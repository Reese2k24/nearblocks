import { Job } from 'bullmq';

import { VerificationKind } from '#types/enums';
import { verifyMail, resetMail, updateMail } from '#libs/mailer';

const emailJob = async (job: Job) => {
  switch (job.name) {
    case VerificationKind.VERIFY_EMAIL:
      return await verifyMail({
        email: job.data.email,
        code: job.data.code,
      });
    case VerificationKind.RESET_PASSWORD:
      return await resetMail({
        email: job.data.email,
        code: job.data.code,
      });
    case VerificationKind.UPDATE_EMAIL:
      return await updateMail({
        email: job.data.email,
        code: job.data.code,
        old_email: job.data.old_email,
      });

    default:
      return;
  }
};

export default emailJob;
