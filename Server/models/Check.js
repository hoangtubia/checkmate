const mongoose = require("mongoose");

const CheckSchema = mongoose.Schema(
  {
    monitorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Monitor",
      immutable: true,
    },
    status: {
      type: Boolean,
    },
    responseTime: {
      type: Number, // milliseconds
    },
    statusCode: {
      type: Number, // 200, ... , 500
    },
    message: {
      type: String,
    },
    expiry: {
      type: Date,
      default: Date.now,
      expires: 60 * 60 * 24 * 30, // 30 days in seconds
    },
  },

  {
    timestamps: true,
  }
);

CheckSchema.pre("save", async function (next) {
  const monitor = await mongoose.model("Monitor").findById(this.monitorId);

  if (monitor.status === true && this.status === false) {
    console.log("Monitor went down");
  }

  if (monitor.status === false && this.status === true) {
    console.log("Monitor went up");
  }

  monitor.status = this.status;
  await monitor.save();

  next;
});

module.exports = mongoose.model("Check", CheckSchema);
