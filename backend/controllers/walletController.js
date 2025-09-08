 import Razorpay from "razorpay";
import crypto from "crypto";
import Wallet from "../models/Wallet.js";
import PaymentTransaction from "../models/PaymentTransaction.js";
import User from "../models/User.js";

// Initialize Razorpay instance
let razorpay = null;
try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
} catch (error) {
  console.error("Error initializing Razorpay:", error);
}

// @desc   Get or create wallet for logged-in user
// @route  GET /api/wallet
export const getWallet = async (req, res) => {
  try {
    const userId = req.user.id;

    let wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      wallet = await Wallet.create({ user: userId });
    }

    res.json({
      success: true,
      wallet: {
        balance: wallet.balance,
        currency: wallet.currency,
        isActive: wallet.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get wallet" });
  }
};

// @desc   Create Razorpay deposit order
// @route  POST /api/wallet/deposit
export const createDepositOrder = async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    const userId = req.user.id;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    let wallet = await Wallet.findOne({ user: userId });
    if (!wallet) wallet = await Wallet.create({ user: userId });

    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: "Payment service not configured",
      });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: "INR",
      receipt: `deposit_${userId}_${Date.now()}`,
      notes: { userId, type: "wallet_deposit" },
    });

    const transaction = await PaymentTransaction.create({
      user: userId,
      wallet: wallet._id,
      type: "deposit",
      amount,
      paymentMethod: paymentMethod || "upi",
      razorpayOrderId: order.id,
      description: "Wallet deposit",
      status: "pending",
    });

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      transactionId: transaction._id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create deposit order" });
  }
};

// @desc   Verify Razorpay payment and update wallet
// @route  POST /api/wallet/verify
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, transactionId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    const transaction = await PaymentTransaction.findById(transactionId);
    if (!transaction) return res.status(404).json({ success: false, message: "Transaction not found" });

    transaction.razorpayPaymentId = razorpay_payment_id;
    transaction.razorpaySignature = razorpay_signature;
    transaction.status = "completed";
    await transaction.save();

    if (transaction.type === "deposit") {
      await Wallet.findByIdAndUpdate(transaction.wallet, { $inc: { balance: transaction.amount } });
    }

    res.json({ success: true, message: "Payment verified", transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};

// @desc   Create withdrawal request
// @route  POST /api/wallet/withdraw
export const createWithdrawRequest = async (req, res) => {
  try {
    const { amount, bankAccount } = req.body;
    const userId = req.user.id;

    if (!amount || amount <= 0) return res.status(400).json({ success: false, message: "Invalid amount" });

    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) return res.status(404).json({ success: false, message: "Wallet not found" });

    if (wallet.balance < amount)
      return res.status(400).json({ success: false, message: "Insufficient balance" });

    const transaction = await PaymentTransaction.create({
      user: userId,
      wallet: wallet._id,
      type: "withdraw",
      amount,
      paymentMethod: "bank_transfer",
      description: "Wallet withdrawal",
      reference: bankAccount,
      status: "processing",
    });

    await Wallet.findByIdAndUpdate(wallet._id, { $inc: { balance: -amount } });

    res.json({ success: true, message: "Withdrawal request created", transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create withdrawal request" });
  }
};

// @desc   Get transaction history
// @route  GET /api/wallet/transactions
export const getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, type } = req.query;

    const query = { user: userId };
    if (type) query.type = type;

    const transactions = await PaymentTransaction.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select("-razorpaySignature -__v");

    const totalTransactions = await PaymentTransaction.countDocuments(query);

    res.json({
      success: true,
      transactions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalTransactions / limit),
        totalTransactions,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get transaction history" });
  }
};

// @desc   Handle Razorpay webhook events
// @route  POST /api/wallet/webhook
export const handleWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const webhookSignature = req.headers["x-razorpay-signature"];

    if (webhookSecret) {
      const body = JSON.stringify(req.body);
      const expectedSignature = crypto.createHmac("sha256", webhookSecret).update(body).digest("hex");
      if (expectedSignature !== webhookSignature) return res.status(400).json({ error: "Invalid webhook signature" });
    }

    const event = req.body;

    switch (event.event) {
      case "payment.captured":
        console.log("Payment captured:", event.payload.payment.entity.id);
        break;
      case "payment.failed":
        console.log("Payment failed:", event.payload.payment.entity.id);
        break;
      default:
        console.log("Unhandled webhook event:", event.event);
    }

    res.json({ status: "ok" });
  } catch (error) {
    res.status(500).json({ error: "Webhook processing failed" });
  }
};
