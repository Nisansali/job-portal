import { Grid, Typography } from "@material-ui/core";
import Cover from '../images/cover.jpg';

const Welcome = (props) => {
  return (
    <div>
    {/* <Grid
      container
      item
      direction="column"
      alignItems="center"
      justify="center"
      style={{ padding: "30px", minHeight: "93vh" }}
    >
   
      <Grid item>
        <Typography variant="h2">Welcome to Job Portal</Typography>
       
      </Grid>
    </Grid> */}
    <div>
          <h4>Welcome to Job Portal Web Application</h4>
          <img src={Cover} alt="Cover Image" height={450}  width={700}/> {/* Use the imported image as the source */}
        </div>
        </div>
  );
};

export const ErrorPage = (props) => {
  return (
    <Grid
      container
      item
      direction="column"
      alignItems="center"
      justify="center"
      style={{ padding: "30px", minHeight: "93vh" }}
    >
      <Grid item>
        <Typography variant="h2">Error 404</Typography>
      </Grid>
    </Grid>
  );
};

export default Welcome;
