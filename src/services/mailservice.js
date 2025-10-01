const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

const sendMail = async (to, subject, html) => {
    return new Promise((resolve, reject) => {
        const mailConfigurations = {
            from: `ParkPro <${process.env.MAIL_USER}>`,
            to,
            subject,
            html,
        };
        transporter.sendMail(mailConfigurations, function (error, info) {
            if (error) return reject(error);
            return resolve(info);
        });
    });
};

module.exports = {
    welcomeMail: async (username) => {
        try {
            console.log("Sending welcome email to:", username.email);

            const html = `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; border: 1px solid #e0e0e0;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #F38529;">Welcome to ParkPro!</h2>
            <p style="color: #777; font-size: 14px;">We're glad to have you on board</p>
          </div>

          <p>Dear ${username.username} ${username.lastname},</p>

          <p>Thank you for creating your account at <strong>ParkPro</strong>. We’re excited to be your trusted destination for quality products and service.</p>

          <p><strong>Your registered email:</strong> ${username.email}</p>

          <div style="background-color: #fef1e8; padding: 15px; border-left: 4px solid #F38529; margin: 20px 0; border-radius: 3px;">
            <p style="margin: 0;">Enjoy a seamless shopping experience with our commitment to quality and customer satisfaction.</p>
          </div>

          <p>If you have any questions, feel free to reach out to us. We're here to help!</p>

          <p style="margin-top: 20px;">Best regards,<br/><strong style="color: #F38529;">The ParkPro Team</strong></p>

          <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #777; text-align: center;">
            <p>This is a system-generated email. Please do not reply to this message.</p>
          </div>
        </div>
      </div>
    `;

            await sendMail(username.email, "Welcome to ParkPro!", html);
        } catch (err) {
            console.error("Error sending welcome email:", err);
            throw new Error("Failed to send welcome email");
        }
    },

    sendOTPmail: async ({ email, code }) => {
        console.log(email, code);
        try {
            const html = `<div> \r\n<p>Hello,<\/p>\r\n\r\n<p> Welcome to <strong>
      ParkPro </strong>. <\/p>\r\n\r\n<p>Your One-Time password  code is: <strong>${code}</strong>. This passcode will expire in 5 minutes<\/p>\r\n<\/br>Thanks,<\/p>\r\n\r\n<p><b>
      The ParkPro Account Team<\/b><\/p><\/div>`;

            return await sendMail(email, "Password Reset Instructions", html);
        } catch (err) {
            console.log(err);
            throw new Error("Could not send OTP mail");
        }
    },

    passwordChange: async ({ email }) => {
        try {
            const html = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2 style="color: #333;">Password Reset Notification</h2>
          <p>Hello ${email},</p>
          <p>This is to inform you that your password has been reset.</p>
  
          <p>If you didn’t make this change or believe it was unauthorized, please contact support immediately.</p>
  
          <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;" />
          <p style="font-size: 12px; color: #aaa;">&copy; ${new Date().getFullYear()} ParkPro Team . All rights reserved.</p>
        </div> `;
            return await sendMail(email, "PASSWORD RESET NOTIFICATION EMAIL", html);
        } catch (err) {
            throw new Error("Could not send OTP mail");
        }
    },

    addParkingSpot: async ({ parkingSpot, orderId, carBrand, carColor }) => {
        try {
            const html = `
        <div> 
          <p>Hello,</p>
          <p>
            The customer has arrived and is waiting at Parking Spot 
            <strong>${parkingSpot}</strong>. Please bring out their order at your earliest convenience.
          </p>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Car Brand:</strong> ${carBrand}</p>
          <p><strong>Car Color:</strong> ${carColor}</p>
          <p>Thank You,</p>
          <p><strong>ParkPro Team</strong></p>
        </div>
      `;
            return await sendMail(
                process.env.MAIL_USER,
                `Customer Arrival – Curbside Pickup at Parking Spot - OrderId: ${orderId}`,
                html
            );
        } catch (err) {
            console.error("Error sending email:", err);
            throw new Error("Could not send parking spot email");
        }
    },

    customerReachStore: async ({ Name, mobileNo, email, orderId }) => {
        try {
            const html = `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; border: 1px solid #e0e0e0;">
            <h2 style="color: #F38529;">Customer Arrival Notification</h2>
            <p>Hello,</p>
            <p>The customer has arrived at the store for their Product Pickup.</p>
            <p>Order ID: <strong>${orderId}</strong></p>
            <p>Customer Details:</p>
            <p>Name: <strong>${Name}</strong></p>
            <p>Mobile Number: <strong>${mobileNo}</strong></p>
            <p>Email: <strong>${email}</strong></p>
            <div style="margin-top: 20px; padding: 15px; background-color: #fef1e8; border-left: 4px solid #F38529;">
              <p><strong style="color: #F38529;">Address:</strong> 11360 Bellaire Blvd Suite 700,<br/>
              Houston, TX 77072<br/>
              <strong style="color: #F38529;">Phone:</strong> 832-230-9288</p>
               <strong style="color: #F38529;">Business Hours:</strong> 9AM - 6PM</p>
            </div>
            <p style="margin-top: 30px;">Thank You</p>
            <p><strong style="color: #F38529;">ParkPro Team</strong></p>
          </div>
        </div>
      `;
            return await sendMail(
                process.env.MAIL_USER,
                `Customer Arrival – In Store Pickup at Store - Order Id: ${orderId}`,
                html
            );
        } catch (err) {
            console.error("Error sending email:", err);
            throw new Error("Could not send parking spot mail");
        }
    },

    orderReady: async ({ email, id }) => {
        try {
            const html = `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; border: 1px solid #e0e0e0;">
          <h2 style="color: #F38529;">Your Order is Ready!</h2>
          <p>Hello,</p>
          <p>Your order is ready for pickup!</p>
          <p>Your Order ID: <strong>${id}</strong></p>
          <p><strong>Please park your Vehicle in store’s front parking Spot, </strong> click on "I'm here" on your mobile device, enter your vehicle model and color and ready to provide secrect code , our team will bring your items to you shortly.</p>
          <div style="margin-top: 20px; padding: 15px; background-color: #fef1e8; border-left: 4px solid #F38529;">
            <p><strong style="color: #F38529;">Store Pickup Location:</strong><br/>
            11360 Bellaire Blvd Suite 700,<br/>
            Houston, TX 77072<br/>
            <strong style="color: #F38529;">Phone:</strong> 832-230-9288 <br/>
            <strong style="color: #F38529;">Business Hours:</strong> 9AM - 6PM</p>
          </div>
          <p style="margin-top: 30px;">Thank you for shopping with us.</p>
          <p><strong style="color: #F38529;">ParkPro Team</strong></p>
        </div>
      </div>
    `;
            return await sendMail(email, "Your Order is Ready for Pickup!", html);
        } catch (err) {
            console.error("Error sending email:", err);
            throw new Error("Could not send Notifications");
        }
    },

    orderPreparing: async ({ email, orderId }) => {
        try {
            const html = `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; border: 1px solid #e0e0e0;">
          <h2 style="color: #F38529;">Your Order is Preparing!</h2>
          <p>Hello,</p>
          <p>Your order is being prepared!</p>
          <p>Your Order ID: <strong>${orderId}</strong></p>
          <p><strong>Please be patient, </strong> our team will bring your items to you shortly.</p>
          <div style="margin-top: 20px; padding: 15px; background-color: #fef1e8; border-left: 4px solid #F38529;">
            <p><strong style="color: #F38529;">Store Pickup Location:</strong><br/>
            11360 Bellaire Blvd Suite 700,<br/>
            Houston, TX 77072<br/>
            <strong style="color: #F38529;">Phone:</strong> 832-230-9288 <br/>
            <strong style="color: #F38529;">Business Hours:</strong> 9AM - 6PM</p>
          </div>
          <p style="margin-top: 30px;">Thank you for shopping with us.</p>
          <p><strong style="color: #F38529;">ParkPro Team</strong></p>
        </div>
      </div>
    `;
            return await sendMail(email, "Your Order is Ready for Pickup!", html);
        } catch (err) {
            console.error("Error sending email:", err);
            throw new Error("Could not send Notifications");
        }
    },
    orderReadyStore: async ({ email, id }) => {
        try {
            const html = `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; border: 1px solid #e0e0e0;">
            <h2 style="color: #F38529;">Your Order is Ready!</h2>
            <p>Hello,</p>
            <p>Your order is ready!</p>
            <p>Your Order ID: <strong>${id}</strong></p>
            <p>Please Come inside Store and Click on "I'm here" on your mobile device and present your secret code for pickup. </p>
            <div style="margin-top: 20px; padding: 15px; background-color: #fef1e8; border-left: 4px solid #F38529;">
              <p><strong style="color: #F38529;">Store Pickup Location:</strong><br/>
              11360 Bellaire Blvd Suite 700,<br/>
              Houston, TX 77072<br/>
              <strong style="color: #F38529;">Phone:</strong> 832-230-9288 <br/>
              <strong style="color: #F38529;">Business Hours:</strong> 9AM - 6PM</p>
            </div>
            <p style="margin-top: 30px;">Thank you for shopping with us.</p>
            <p><strong style="color: #F38529;">ParkPro Team</strong></p>
          </div>
        </div>
      `;
            return await sendMail(email, "Your Order is Ready for Pickup!", html);
        } catch (err) {
            console.error("Error sending email:", err);
            throw new Error("Could not send Notifications");
        }
    },

    order: async ({ email, orderId }) => {
        try {
            const html = `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; border: 1px solid #e0e0e0;">
          <h2 style="color: #F38529;">Thank You for Your Order</h2>
          <p>Hello,</p>
          <p>Thank you for placing your order with us!</p>
          <p>Order ID: <strong>${orderId}</strong></p>
         
          <p style="margin-top: 20px;">
            Now just sit back and relax while we get to work. We’ll reach out soon to let you know via email your order is ready for pickup/delivery/shipping.
          </p>
           <p>We appreciate your business and look forward to serving you again!</p>
          <p style="margin-top: 30px;">Best regards,</p>
          <p><strong style="color: #F38529;">ParkPro Team</strong></p>
        </div>
      </div>
    `;
            return await sendMail(
                email,
                `Thank You for Your Order – Order ID: ${orderId}`,
                html
            );
        } catch (err) {
            console.error("Error sending email:", err);
            throw new Error("Could not send Notifications");
        }
    },

    orderCancel: async ({ email, orderId }) => {
        try {
            const html = `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; border: 1px solid #e0e0e0;">
            <h2 style="color: #F38529;">Order Cancelled</h2>
            <p>Hello,</p>
            <p>Your order with Order ID: <strong>${orderId}</strong> has been successfully cancelled.</p>
            <div style="margin-top: 20px; padding: 15px; background-color: #fef1e8; border-left: 4px solid #F38529;">
              <p><strong style="color: #F38529;">Address:</strong> 11360 Bellaire Blvd Suite 700,<br/>
              Houston, TX 77072<br/>
              <strong style="color: #F38529;">Phone:</strong> 832-230-9288</p>
            </div>
            <p style="margin-top: 30px;">If you have any questions, feel free to reach out to us.</p>
            <p><strong style="color: #F38529;">ParkPro Team</strong></p>
          </div>
        </div>
      `;
            return await sendMail(
                email,
                `Order Cancelled - Order ID: ${orderId}`,
                html
            );
        } catch (err) {
            console.error("Error sending email:", err);
            throw new Error("Could not send Notifications");
        }
    },

    orderCancelAdmin: async ({ email, orderId }) => {
        try {
            const html = `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; border: 1px solid #e0e0e0;">
          <h2 style="color: #F38529;">Order Cancellation Notice</h2>
          <p>Dear Admin,</p>
          <p>The customer with email <strong>${email}</strong> has cancelled their order.</p>
          <p>Order ID: <strong>${orderId}</strong></p>
          <p>Please update the system accordingly.</p>
          <p style="margin-top: 30px;">Regards,<br/>System Notification</p>
        </div>
      </div>
    `;
            return await sendMail(
                process.env.MAIL_USER,
                `Order Cancelled by Customer – Order ID: ${orderId}`,
                html
            );
        } catch (err) {
            console.error("Error sending email:", err);
            throw new Error("Could not send Notifications");
        }
    },

    MessageToCustomer: async ({ customerEmail, message }) => {
        try {
            const html = `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; border: 1px solid #e0e0e0;">
            <h2 style="color: #F38529;">Message from ParkPro Team</h2>
            <p>Dear Customer,</p>
            <p>${message}</p>
  
            <div style="margin-top: 20px; padding: 15px; background-color: #fef1e8; border-left: 4px solid #F38529;">
              <p><strong style="color: #F38529;">Address:</strong> 11360 Bellaire Blvd Suite 700,<br/>
              Houston, TX 77072<br/>
             <strong style="color: #F38529;">Phone:</strong> 832-230-9288</p></p>
              
            </div>
  
            <p style="margin-top: 30px;">If you have any questions, feel free to contact our support.</p>
            <p>Best regards,<br/><strong style="color: #F38529;>ParkPro Team</strong></p>
          </div>
        </div>
      `;

            return await sendMail(
                customerEmail,
                "Message from ParkPro Team",
                html
            );
        } catch (err) {
            console.error("Error sending email to customer:", err);
            throw new Error("Could not send email to customer");
        }
    },
    sendTrackingInfoEmail: async ({
        email,
        orderId,
        trackingNo,
        shippingCompany,
    }) => {
        try {
            const html = `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; border: 1px solid #e0e0e0;">
          <h2 style="color: #F38529;">Your Order Has Been Shipped!</h2>
  
          <p>Dear Customer,</p>
          <p>We’re excited to let you know that your order is on its way. Below are your shipping details:</p>
  
          <ul style="line-height: 1.8;">
            <li><strong style="color: #F38529;">Order ID:</strong> ${orderId}</li>
            <li><strong style="color: #F38529;">Tracking Number:</strong> ${trackingNo}</li>
            <li><strong style="color: #F38529;">Shipping Company:</strong> ${shippingCompany}</li>
          </ul>
  
          <p>You can track your package using the tracking number on the shipping company’s website.</p>
  
          <div style="margin-top: 20px; padding: 15px; background-color: #fef1e8; border-left: 4px solid #F38529;">
            <p><strong style="color: #F38529;">Need Help?</strong><br/>
            Address: 11360 Bellaire Blvd Suite 700, Houston, TX 77072<br/>
            Phone: 832-230-9288</p>
            <strong style="color: #F38529;">Business Hours:</strong> 9AM - 6PM</p>
          </div>
  
          <p style="margin-top: 30px;">Thank you for shopping with us!</p>
          <p>Best regards,<br/><strong style="color: #F38529;">ParkPro Team</strong></p>
        </div>
      </div>
    `;

            return await sendMail(
                email,
                "Your Order Has Been Shipped - ParkPro",
                html
            );
        } catch (err) {
            console.error("Error sending email to customer:", err);
            throw new Error("Could not send email to customer");
        }
    },
    sendDriverInfoEmail: async ({
        email,
        orderId,
    }) => {
        try {
            const html = `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; border: 1px solid #e0e0e0;">
          <h2 style="color: #F38529;">Your Order Has Been Shipped!</h2>
  
          <p>Dear Customer,</p>
          <p>We’re excited to let you know that your order is on its way. Below are your shipping details:</p>
  
          <ul style="line-height: 1.8;">
            <li><strong style="color: #F38529;">Order ID:</strong> ${orderId}</li>
          </ul>
  
          <p>You can get your order soon!</p>
  
          <div style="margin-top: 20px; padding: 15px; background-color: #fef1e8; border-left: 4px solid #F38529;">
            <p><strong style="color: #F38529;">Need Help?</strong><br/>
            Address: 11360 Bellaire Blvd Suite 700, Houston, TX 77072<br/>
            Phone: 832-230-9288</p>
            <strong style="color: #F38529;">Business Hours:</strong> 9AM - 6PM</p>
          </div>
  
          <p style="margin-top: 30px;">Thank you for shopping with us!</p>
          <p>Best regards,<br/><strong style="color: #F38529;">ParkPro Team</strong></p>
        </div>
      </div>
    `;

            return await sendMail(
                email,
                "Your Order Has Been Shipped - ParkPro",
                html
            );
        } catch (err) {
            console.error("Error sending email to customer:", err);
            throw new Error("Could not send email to customer");
        }
    },
    sendWelcomeEmailToEmployee: async ({ email, name, password }) => {
        try {
            const html = `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; border: 1px solid #ddd;">
          <h2 style="color: #F38529; text-align: center;">Welcome to ParkPro!</h2>

          <p>Dear <strong>${name}</strong>,</p>

          <p>We are pleased to welcome you to the <strong>ParkPro Team</strong>. You are now officially part of our growing organization, and we’re excited to have you on board.</p>

          <p>Please use the link below to access your employee dashboard and begin your journey with us:</p>
          <p>
         You can log in using the following credentials:<br/>
         <strong>Email:</strong> ${email}<br/>
         <strong>Password:</strong> ${password}
         </p>

          <div style="text-align: center; margin: 20px 0;">
            <a href="https://www.admin.bachhoahouston.com/login" 
               style="background-color: #F38529; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
              Login to Admin Dashboard
            </a>
          </div>

          <p>If you have any questions or need assistance with your account setup, feel free to reach out to the admin team.</p>

          <div style="margin-top: 25px; padding: 15px; background-color: #fef1e8; border-left: 4px solid #F38529;">
            <p><strong style="color: #F38529;">Support Contact</strong><br/>
            Address: 11360 Bellaire Blvd Suite 700, Houston, TX 77072<br/>
            Phone: 832-230-9288</p>
          </div>

          <p style="margin-top: 30px;">We look forward to working with you!</p>
          <p>Best regards,<br/><strong style="color: #F38529;">ParkPro Team</strong></p>
        </div>
      </div>
    `;

            return await sendMail(
                email,
                "Welcome to ParkPro – Your Employee Access",
                html
            );
        } catch (err) {
            console.error("Error sending welcome email:", err);
            throw new Error("Could not send welcome email");
        }
    },
    orderReturnRequested: async ({ email, orderId }) => {
        try {
            const html = `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; border: 1px solid #e0e0e0;">
          <h2 style="color: #F38529;">Return Requested</h2>
          <p>Hello,</p>
          <p>We’ve received a return request for your order with Order ID: <strong>${orderId}</strong>.</p>

          <div style="margin-top: 20px; padding: 15px; background-color: #fef1e8; border-left: 4px solid #F38529;">
            <p><strong>Please Note:</strong></p>
            <ul>
              <li>You must send <strong>images or videos</strong> of the product within <strong>24 hours</strong> of delivery.</li>
              <li>If the order is already past 24 hours, the return will not be accepted.</li>
              <li>Products must be in original condition and packaging.</li>
              <li><strong>We do not accept returns for food items</strong> as per our return policy.</li>
            </ul>
          </div>

          <p style="margin-top: 20px;">Please reply to this email with photos or videos showing the issue with the product.</p>
          <p>For full details, please refer to our <a href="https://www.bachhoahouston.com/ReturnPolicy" style="color: #F38529;">Return Policy</a>.</p>

          <div style="margin-top: 30px; padding: 15px; background-color: #fef1e8; border-left: 4px solid #F38529;">
            <p><strong style="color: #F38529;">Address:</strong> 11360 Bellaire Blvd Suite 700,<br/>
            Houston, TX 77072<br/>
            <strong style="color: #F38529;">Phone:</strong> 832-230-9288</p>
          </div>

          <p style="margin-top: 30px;">Thank you for shopping with us.</p>
          <p><strong style="color: #F38529;">ParkPro Team</strong></p>
        </div>
      </div>
    `;
            return await sendMail(
                email,
                `Return Request Received - Order ID: ${orderId}`,
                html
            );
        } catch (err) {
            console.error("Error sending return request email:", err);
            throw new Error("Could not send Notifications");
        }
    },
    orderDelivered: async ({ email, orderId }) => {
        try {
            const html = `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; border: 1px solid #e0e0e0;">
          <h2 style="color: #F38529;">Order Delivered Successfully</h2>
          <p>Hello,</p>
          <p>We're happy to let you know that your order with Order ID: <strong>${orderId}</strong> has been <strong>successfully delivered</strong>.</p>

          <div style="margin-top: 20px; padding: 15px; background-color: #fef1e8; border-left: 4px solid #F38529;">
            <p><strong>Need Help?</strong></p>
            <ul>
              <li>If you notice any issue with your order, please reply to this email within <strong>24 hours</strong> of delivery.</li>
              <li>Attach any relevant <strong>photos or videos</strong> to help us resolve your issue quickly.</li>
              <li><strong>Note:</strong> We do not accept returns for food items, as per our policy.</li>
            </ul>
          </div>

          <p style="margin-top: 20px;">Thank you for shopping with us. We hope you enjoy your purchase!</p>
          <p>For more details, you can always refer to our <a href="https://www.bachhoahouston.com/ReturnPolicy" style="color: #F38529;">Return Policy</a>.</p>

          <div style="margin-top: 30px; padding: 15px; background-color: #fef1e8; border-left: 4px solid #F38529;">
            <p><strong style="color: #F38529;">Address:</strong> 11360 Bellaire Blvd Suite 700,<br/>
            Houston, TX 77072<br/>
            <strong style="color: #F38529;">Phone:</strong> 832-230-9288</p>
          </div>

          <p style="margin-top: 30px;"><strong style="color: #F38529;">ParkPro Team</strong></p>
        </div>
      </div>
    `;
            return await sendMail(
                email,
                `Your Order Has Been Delivered - Order ID: ${orderId}`,
                html
            );
        } catch (err) {
            console.error("Error sending delivery email:", err);
            throw new Error("Could not send Notifications");
        }
    },
    orderReturnSuccess: async ({ email, orderId }) => {
        try {
            const html = `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; border: 1px solid #e0e0e0;">
          <h2 style="color: #F38529;">Return Processed Successfully</h2>
          <p>Hello,</p>
          <p>We're writing to let you know that your return request for Order ID: <strong>${orderId}</strong> has been successfully processed.</p>

          <div style="margin-top: 20px; padding: 15px; background-color: #fef1e8; border-left: 4px solid #F38529;">
            <p><strong>What’s Next?</strong></p>
            <ul>
              <li>If a refund or store credit is applicable, it will be processed shortly.</li>
              <li>You’ll receive another email notification once it’s completed.</li>
              <li>If you have any questions, feel free to reply to this email or contact our support team.</li>
            </ul>
          </div>

          <p style="margin-top: 20px;">We appreciate your cooperation. Thank you for being a valued customer.</p>

          <div style="margin-top: 30px; padding: 15px; background-color: #fef1e8; border-left: 4px solid #F38529;">
            <p><strong style="color: #F38529;">Address:</strong> 11360 Bellaire Blvd Suite 700,<br/>
            Houston, TX 77072<br/>
            <strong style="color: #F38529;">Phone:</strong> 832-230-9288</p>
          </div>

          <p style="margin-top: 30px;"><strong style="color: #F38529;">ParkPro Team</strong></p>
        </div>
      </div>
    `;
            return await sendMail(
                email,
                `Return Completed - Order ID: ${orderId}`,
                html
            );
        } catch (err) {
            console.error("Error sending return success email:", err);
            throw new Error("Could not send Notifications");
        }
    },

    orderCancelByAdmin: async ({ email, orderId, reason }) => {
        try {
            const html = `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; border: 1px solid #e0e0e0;">
          <h2 style="color: #F38529;">Order Cancelled by Admin</h2>
          <p>Hello,</p>
          <p>Your order with Order ID: <strong>${orderId}</strong> has been cancelled by our team.</p>

          <div style="margin-top: 15px; padding: 15px; background-color: #fef1e8; border-left: 4px solid #F38529;">
            <p><strong style="color: #F38529;">Reason for Cancellation:</strong><br/>${reason}</p>
          </div>

          <div style="margin-top: 20px; padding: 15px; background-color: #fef1e8; border-left: 4px solid #F38529;">
            <p><strong style="color: #F38529;">Address:</strong> 11360 Bellaire Blvd Suite 700,<br/>
            Houston, TX 77072<br/>
            <strong style="color: #F38529;">Phone:</strong> 832-230-9288</p>
          </div>

          <p style="margin-top: 30px;">If you have any questions, feel free to reach out to us.</p>
          <p><strong style="color: #F38529;">ParkPro Team</strong></p>
        </div>
      </div>
    `;

            return await sendMail(
                email,
                `Order Cancelled by Admin - Order ID: ${orderId}`,
                html
            );
        } catch (err) {
            console.error("Error sending email:", err);
            throw new Error("Could not send admin cancellation email");
        }
    },
    orderConvertedToShipmentByAdmin: async ({ email, orderId }) => {
        try {
            const html = `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; border: 1px solid #e0e0e0;">
          <h2 style="color: #F38529;">Order Delivery Method Updated</h2>
          <p>Hello,</p>
          <p>We would like to inform you that your order with Order ID: <strong>${orderId}</strong> has been updated by our team.</p>

          <div style="margin-top: 15px; padding: 15px; background-color: #f0faff; border-left: 4px solid #007BFF;">
            <p><strong style="color: #007BFF;">New Delivery Method:</strong><br/>
            Shipment (Home Delivery)</p>
            <p>Previously selected pickup option has been cancelled.</p>
          </div>

          <div style="margin-top: 20px; padding: 15px; background-color: #fef1e8; border-left: 4px solid #F38529;">
            <p><strong style="color: #F38529;">Address:</strong> 11360 Bellaire Blvd Suite 700,<br/>
            Houston, TX 77072<br/>
            <strong style="color: #F38529;">Phone:</strong> 832-230-9288</p>
          </div>

          <p style="margin-top: 30px;">If you have any questions or would like to make changes, please contact us.</p>
          <p><strong style="color: #F38529;">ParkPro Team</strong></p>
        </div>
      </div>
    `;

            return await sendMail(
                email,
                `Order Updated - Converted to Shipment (Order ID: ${orderId})`,
                html
            );
        } catch (err) {
            console.error("Error sending conversion email:", err);
            throw new Error("Could not send shipment conversion email");
        }
    },
    MessageToAllCustomer: async ({ customerEmail, message }) => {
        try {
            const currentDate = new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });

            const html = `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; border: 1px solid #e0e0e0;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #F38529; margin-bottom: 5px;">Important Announcement</h2>
              <p style="color: #777; font-size: 14px;">${currentDate}</p>
            </div>
            
            <p>Dear Valued Customer,</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="line-height: 1.6;">${message}</p>
            </div>
            
            <div style="margin-top: 25px; padding: 15px; background-color: #fef1e8; border-left: 4px solid #F38529; border-radius: 3px;">
              <p style="margin: 0;"><strong style="color: #F38529;">Visit Us:</strong> 11360 Bellaire Blvd Suite 700, Houston, TX 77072</p>
              <p style="margin: 10px 0 0;"><strong style="color: #F38529;">Call Us:</strong> 832-230-9288</p>
            </div>
            
            <p style="margin-top: 25px;">Thank you for being our customer. If you have any questions, please don't hesitate to contact us.</p>
            
            <p style="margin-top: 20px;">Best regards,<br/><strong style="color: #F38529;">ParkPro Team</strong></p>
            
            <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #777; text-align: center;">
              <p>This is a system-generated email. Please do not reply to this message.</p>
            </div>
          </div>
        </div>
      `;

            return await sendMail(
                customerEmail,
                "Important Announcement from ParkPro",
                html
            );
        } catch (err) {
            console.error("Error sending bulk email:", err);
            throw new Error("Failed to send announcement email");
        }
    },
    orderDeliveredForLocalDelievry: async ({
        email,
        orderId,
        proofOfDelivery = [],
    }) => {
        try {
            const proofImagesHTML = proofOfDelivery
                .map(
                    (imgUrl, index) => `
          <div style="margin-top: 10px;">
            <img src="${imgUrl}" alt="Proof ${index + 1
                        }" style="max-width: 100%; border-radius: 6px; border: 1px solid #ccc;" />
          </div>`
                )
                .join("");

            const html = `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; border: 1px solid #e0e0e0;">
          <h2 style="color: #F38529;">Local Delivery Completed</h2>
          <p>Hello,</p>
          <p>Your order with Order ID: <strong>${orderId}</strong> has been <strong>successfully delivered</strong> to your address.</p>

          ${proofOfDelivery.length > 0
                    ? `<div style="margin-top: 20px;">
                  <p><strong>Proof of Delivery:</strong></p>
                  ${proofImagesHTML}
                </div>`
                    : ""
                }

          <div style="margin-top: 20px; padding: 15px; background-color: #fef1e8; border-left: 4px solid #F38529;">
            <p><strong>Need Assistance?</strong></p>
            <ul>
              <li>If there is any issue with your delivery, please respond to this email within <strong>24 hours</strong>.</li>
              <li>Include <strong>clear photos or videos</strong> to help us resolve the issue quickly.</li>
              <li><strong>Note:</strong> Per our policy, food items are <strong>non-returnable</strong>.</li>
            </ul>
          </div>

          <p style="margin-top: 20px;">We appreciate your support for local delivery services. Thank you for shopping with us!</p>
          <p>View our full <a href="https://www.bachhoahouston.com/ReturnPolicy" style="color: #F38529;">Return Policy</a> for more details.</p>

          <div style="margin-top: 30px; padding: 15px; background-color: #fef1e8; border-left: 4px solid #F38529;">
            <p><strong style="color: #F38529;">Address:</strong> 11360 Bellaire Blvd Suite 700,<br/>
            Houston, TX 77072<br/>
            <strong style="color: #F38529;">Phone:</strong> 832-230-9288</p>
          </div>

          <p style="margin-top: 30px;"><strong style="color: #F38529;">ParkPro Team</strong></p>
        </div>
      </div>
    `;

            return await sendMail(
                email,
                `Your Local Order Has Been Delivered - Order ID: ${orderId}`,
                html
            );
        } catch (err) {
            console.error("Error sending delivery email:", err);
            throw new Error("Could not send Notifications");
        }
    },
};
