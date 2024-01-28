export default process.env.NODE_ENV === 'production'
  && process.env.DEPLOY_ENV !== 'staging';
