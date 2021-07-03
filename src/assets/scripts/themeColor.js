export default () => {
  const changeThemeColor = (color) => {
    document
      .querySelector('meta[name="theme-color"]')
      .setAttribute('content', color);
  };

  document
    .querySelector('#twitter-social-link')
    .addEventListener('mouseover', () => {
      changeThemeColor('#60a5fa');
    });

  document
    .querySelector('#twitter-social-link')
    .addEventListener('mouseout', () => {
      changeThemeColor('#5706e0');
    });

  document
    .querySelector('#github-social-link')
    .addEventListener('mouseover', () => {
      changeThemeColor('#000000');
    });

  document
    .querySelector('#github-social-link')
    .addEventListener('mouseout', () => {
      changeThemeColor('#5706e0');
    });
};
