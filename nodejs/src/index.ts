import {subscribeToExternalTasks} from './sample_application';

subscribeToExternalTasks()
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
