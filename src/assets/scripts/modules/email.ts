const rawEmail = new Uint8Array([
  104, 101, 108, 108, 111, 64, 114, 121, 97, 110, 99, 99, 110, 46, 100, 101,
  118,
]);

const decoder = new TextDecoder();

let finishedAnim = true;

addEventListener('DOMContentLoaded', () => {
  const button =
    document.querySelector<HTMLButtonElement>('button[data-email]');

  if (button)
    button.addEventListener('click', async () => {
      await navigator.clipboard.writeText(decoder.decode(rawEmail));

      const mailIcon = button.querySelector('[data-email-icon="m"]')!;
      const checkIcon = button.querySelector('[data-email-icon="d"]')!;

      if (finishedAnim) {
        mailIcon.classList.replace('block', 'hidden');
        checkIcon.classList.replace('hidden', 'block');
        finishedAnim = false;

        setTimeout(() => {
          mailIcon.classList.replace('hidden', 'block');
          checkIcon.classList.replace('block', 'hidden');
          finishedAnim = true;
        }, 2500);
      }
    });
});
