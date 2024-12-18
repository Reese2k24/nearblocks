import nodemailer from 'nodemailer';

import config from '#config';
import reset from '#libs/templates/reset';
import verify from '#libs/templates/verify';
import updateEmail from '#libs/templates/updateEmail';

export type VerifyData = {
  email: string;
  code: string;
  subject?: string;
};

export type UpdateEmailData = {
  old_email: string;
  email: string;
  code: string;
  subject?: string;
};

const mailer = nodemailer.createTransport({
  host: config.smtpHost,
  port: config.smtpPort,
  auth: {
    user: config.smtpUser,
    pass: config.smtpPass,
  },
});

export const verifyMail = async (data: VerifyData) => {
  const subject = 'Please confirm your email [NearBlocks.io]';
  data.subject = subject;
  const message = {
    from: config.smtpMail,
    to: data.email,
    subject,
    html: verify(data),
  };

  return mailer.sendMail(message);
};

export const resetMail = async (data: VerifyData) => {
  const subject = 'Lost Password recovery [NearBlocks.io]';
  data.subject = subject;
  const message = {
    from: config.smtpMail,
    to: data.email,
    subject,
    html: reset(data),
  };

  return mailer.sendMail(message);
};

export const updateMail = async (data: UpdateEmailData) => {
  const subject = 'Please confirm your email [NearBlocks.io]';
  data.subject = subject;
  const message = {
    from: config.smtpMail,
    to: data.email,
    subject,
    html: updateEmail(data),
  };

  return mailer.sendMail(message);
};

export default mailer;
