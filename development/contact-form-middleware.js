"use strict";

// TODO - Setup email provider (nodemailer)

/**
 * contact-form-submission controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

// TODO - replace with email or use .env here
const noreplyEmail = "example.noreply@gmail.com"

module.exports = createCoreController(
	"api::contact-form-submission.contact-form-submission", //TODO - make sure this line matches the api id
	({ strapi }) => ({
		// Wraps core create route
		async create(ctx) {
			const notificationRecipients = await strapi.entityService.findMany(
				"api::notification-recipient.notification-recipient"
			); // TODO - notification recipient collection with 'Email' field should be set up

			// Calling the default core action
			const { data, meta } = await super.create(ctx);

			const requestData = ctx.request.body.data;

			// send email using strapi email plugin
			await strapi.plugins["email"].services.email.send({
				to: notificationRecipients.map(recipient => recipient.Email),
				from: noreplyEmail,
				subject: "You've received a message from your website!",
				html: `<p>Hi,</p>
	  <p>You've received a message from ${requestData.FirstName} ${requestData.LastName}.</p>
	  <p><strong>Message:</strong></p>
	  <p>${requestData.Message}</p>
	  <p>Here is their contact info:</p>
	  <p>Email: ${requestData.Email}</p>
	  <p>Phone: ${requestData.PhoneNumber}</p>`,
			});

			return { data, meta };
		},
	})
);
