import { mailtrapClient, sender } from "./mailtrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailsTemplates.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });

    console.log("Email sent successfully", response);
  } catch (error) {
    console.error(`Error sending verification`, error);

    throw new Error(`Error sending verification email: ${error}`);
  }
};
export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "71f6142f-4952-49f0-a052-d5c7947fc918",
      template_variables: {
        company_info_name: "Auth Cat Company",
        name: name,
      },
    });
    console.log("Welcome email sent welcome successfully", response);
  } catch (error) {
    console.log(error);
    throw new Error(`Error sending Welcome email: ${error}`);
  }
};
