'use strict';
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    // Auto-generated human-readable reference e.g. "BK-20240315-A1X9"
    booking_reference: {
      type: String,
      unique: true,
    },

    // ─── Relations ──────────────────────────────────────────────
    booked_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    parking_lot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ParkingLot',
      required: true,
    },
    slot_id: {
      type: mongoose.Schema.Types.ObjectId, // ref to the embedded slot _id
      required: true,
    },
    slot_label: {
      type: String,     // snapshot of slot label e.g. "A1" — avoids extra lookup
      required: true,
    },

    // ─── Time ───────────────────────────────────────────────────
    start_time: {
      type: Date,
      required: true,
    },
    end_time: {
      type: Date,
      required: true,
    },
    rental_type: {
      type: String,
      enum: ['hourly', 'daily', 'monthly'],
      required: true,
    },

    // ─── Vehicle ────────────────────────────────────────────────
    license_plate: {
      type: String,     // Swedish format e.g. "ABC 123" or "ABC12D"
      required: true,
      uppercase: true,
      trim: true,
    },

    // ─── Pricing ────────────────────────────────────────────────
    total_price: {
      type: Number,
      min: 0,
      required: true,
    },
    currency: {
      type: String,
      default: 'SEK',
    },

    // ─── Payment ────────────────────────────────────────────────
    payment_status: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Pending',
    },
    payment_reference: {
      type: String,     // ID from payment gateway (Swish, Stripe, etc.)
      default: null,
    },

    // ─── Booking Status ─────────────────────────────────────────
    status: {
      type: String,
      enum: ['Upcoming', 'Active', 'Completed', 'Cancelled'],
      default: 'Upcoming',
    },
    cancelled_at: {
      type: Date,
      default: null,
    },
    cancellation_reason: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

// ─── Auto-generate booking reference before saving ────────────────────────────
bookingSchema.pre('save', function (next) {
  if (!this.booking_reference) {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // "20240315"
    const random = Math.random().toString(36).substring(2, 6).toUpperCase(); // "A1X9"
    this.booking_reference = `BK-${date}-${random}`; // "BK-20240315-A1X9"
  }
  next();
});

// ─── Virtual: duration ───────────────────────────────────────────────
bookingSchema.virtual('duration_display').get(function () {
  const ms = this.end_time - this.start_time;
  const hours  = ms / (1000 * 60 * 60);
  const days   = ms / (1000 * 60 * 60 * 24);
  const months = days / 30;

  switch (this.rental_type) {
    case 'hourly':  return `${hours.toFixed(0)} hour(s)`;   // "2 hour(s)"
    case 'daily':   return `${days.toFixed(0)} day(s)`;     // "3 day(s)"
    case 'monthly': return `${months.toFixed(0)} month(s)`; // "1 month(s)"
    default:        return `${hours.toFixed(1)} hour(s)`;
  }
});

bookingSchema.set('toJSON', {
  getters: true,
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

// ─── Indexes ─────────────────────────────────────────────────────────────────
bookingSchema.index({ booked_by: 1 });
bookingSchema.index({ parking_lot: 1, slot_id: 1 });
bookingSchema.index({ booking_reference: 1 });
bookingSchema.index({ start_time: 1, end_time: 1 }); // for overlap checks

module.exports = mongoose.model('Booking', bookingSchema);