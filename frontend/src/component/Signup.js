import {
  Button,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import axios from "axios";
import ChipInput from "material-ui-chip-input";
import { useContext, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { Navigate } from "react-router-dom";

import { SetPopupContext } from "../App";
import EmailInput from "../lib/EmailInput";
import PasswordInput from "../lib/PasswordInput";

import apiList from "../lib/apiList";
import isAuth from "../lib/isAuth";

const useStyles = makeStyles((theme) => ({
  body: {
    padding: "60px 60px",
  },
  inputBox: {
    width: "600px",
  },
  submitButton: {
    width: "400px",
  },
}));

const EducationSection = (props) => {
  const classes = useStyles();
  const { education, setEducation } = props;

  return (
    <>
      {education.map((obj, key) => (
        <Grid
          item
          container
          className={classes.inputBox}
          key={key}
          style={{ paddingLeft: 0, paddingRight: 0 }}
        >
          <Grid item xs={4}>
            <TextField
              label={`Institution Name #${key + 1}`}
              value={education[key].institutionName}
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].institutionName = event.target.value;
                setEducation(newEdu);
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Start Year"
              value={obj.startYear}
              variant="outlined"
              type="number"
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].startYear = event.target.value;
                setEducation(newEdu);
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="End Year"
              value={obj.endYear}
              variant="outlined"
              type="number"
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].endYear = event.target.value;
                setEducation(newEdu);
              }}
            />
          </Grid>
        </Grid>
      ))}
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            setEducation([
              ...education,
              {
                institutionName: "",
                startYear: "",
                endYear: "",
              },
            ])
          }
          className={classes.inputBox}
        >
          Add another institution details
        </Button>
      </Grid>

    </>
  );
};

const ExperienceSection = (props) => {
  const classes = useStyles();
  const { experience, setExperience } = props;

  return (
    <>
      {experience.map((obj, key) => (
        <Grid
          item
          spacing={2}
          container
          className={classes.inputBox}
          key={key}
          style={{ paddingLeft: 0, paddingRight: 0 }}
        >
          <Grid item xs={6}>
            <TextField
              fullWidth
              label={`Company Name #${key + 1}`}
              value={experience[key].companyName}
              onChange={(event) => {
                const newEx = [...experience];
                newEx[key].companyName = event.target.value;
                setExperience(newEx);
              }}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Position"
              value={obj.position}
              variant="outlined"
              type="text"
              onChange={(event) => {
                const newEx = [...experience];
                newEx[key].position = event.target.value;
                setExperience(newEx);
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="From"
              value={obj.from}
              variant="outlined"
              type="number"
              onChange={(event) => {
                const newEx = [...experience];
                newEx[key].from = event.target.value;
                setExperience(newEx);
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="To"
              value={obj.to}
              variant="outlined"
              type="number"
              onChange={(event) => {
                const newEx = [...experience];
                newEx[key].to = event.target.value;
                setExperience(newEx);
              }}
            />
          </Grid>
        </Grid>
      ))}
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            setExperience([
              ...experience,
              {
                companyName: "",
                from: "",
                to: "",
                position: "",
              },
            ])
          }
          className={classes.inputBox}
        >
          Add another company details
        </Button>
      </Grid>

    </>
  );
};

const Register = (props) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);

  const [loggedin, setLoggedin] = useState(isAuth());

  const [signupDetails, setSignupDetails] = useState({
    type: "applicant",
    email: "",
    password: "",
    name: "",
    education: [],
    experience: [],
    skills: [],
    resume: "",
    profile: "",
    bio: "",
    contactNumber: "",
  });

  const [phone, setPhone] = useState("");
  const [education, setEducation] = useState([
    {
      institutionName: "",
      startYear: "",
      endYear: "",
    },
  ]);

  const [experience, setExperience] = useState([
    {
      companyName: "",
      from: "",
      to: "",
      position: "",
    },
  ])

  const [inputErrorHandler, setInputErrorHandler] = useState({
    email: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    password: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    name: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
  });

  const handleInput = (key, value) => {
    setSignupDetails({
      ...signupDetails,
      [key]: value,
    });
  };

  const handleInputError = (key, status, message) => {
    setInputErrorHandler({
      ...inputErrorHandler,
      [key]: {
        required: true,
        untouched: false,
        error: status,
        message: message,
      },
    });
  };

  const handleLogin = () => {
    const tmpErrorHandler = {};
    Object.keys(inputErrorHandler).forEach((obj) => {
      if (inputErrorHandler[obj].required && inputErrorHandler[obj].untouched) {
        tmpErrorHandler[obj] = {
          required: true,
          untouched: false,
          error: true,
          message: `${obj[0].toUpperCase() + obj.substr(1)} is required`,
        };
      } else {
        tmpErrorHandler[obj] = inputErrorHandler[obj];
      }
    });

    let updatedDetails = {
      ...signupDetails,
      education: education
        .filter((obj) => obj.institutionName.trim() !== "")
        .map((obj) => {
          if (obj["endYear"] === "") {
            delete obj["endYear"];
          }
          return obj;
        }),
      experience: experience
        .filter((obj) => obj.companyName.trim() !== "")
        .map((obj) => {
          if (obj["to"] === "") {
            delete obj["to"];
          }
          return obj;
        }),
    };

    setSignupDetails(updatedDetails);

    const verified = !Object.keys(tmpErrorHandler).some((obj) => {
      return tmpErrorHandler[obj].error;
    });


    if (verified) {
      axios
        .post(apiList.signup, updatedDetails)
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("type", response.data.type);
          setLoggedin(isAuth());
          setPopup({
            open: true,
            severity: "success",
            message: "Logged in successfully",
          });
          console.log(response);
        })
        .catch((err) => {
          console.log(err)
          setPopup({
            open: true,
            severity: "error",
            message: err.response.data.message,
          });
          console.log(err.response);
        });
    } else {
      setInputErrorHandler(tmpErrorHandler);
      setPopup({
        open: true,
        severity: "error",
        message: "Incorrect Input",
      });
    }
  };

  const handleLoginRecruiter = () => {
    const tmpErrorHandler = {};
    Object.keys(inputErrorHandler).forEach((obj) => {
      if (inputErrorHandler[obj].required && inputErrorHandler[obj].untouched) {
        tmpErrorHandler[obj] = {
          required: true,
          untouched: false,
          error: true,
          message: `${obj[0].toUpperCase() + obj.substr(1)} is required`,
        };
      } else {
        tmpErrorHandler[obj] = inputErrorHandler[obj];
      }
    });

    let updatedDetails = {
      ...signupDetails,
    };

    if (phone !== "") {
      updatedDetails = {
        ...signupDetails,
        contactNumber: `+${phone}`,
      };

    } else {
      updatedDetails = {
        ...signupDetails,
        contactNumber: "",
      };
    }

    setSignupDetails(updatedDetails);

    const verified = !Object.keys(tmpErrorHandler).some((obj) => {
      return tmpErrorHandler[obj].error;
    });

    if (verified) {
      axios
        .post(apiList.signup, updatedDetails)
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("type", response.data.type);
          setLoggedin(isAuth());
          setPopup({
            open: true,
            severity: "success",
            message: "Logged in successfully",
          });
          console.log(response);
        })
        .catch((err) => {
          setPopup({
            open: true,
            severity: "error",
            message: err.response.data.message,
          });
          console.log(err.response);
        });
    } else {
      setInputErrorHandler(tmpErrorHandler);
      setPopup({
        open: true,
        severity: "error",
        message: "Incorrect Input",
      });
    }
  };

  return loggedin ? (
    <Navigate to="/" />
  ) : (
    <Paper elevation={3} className={classes.body}>

      <Grid container direction="column" spacing={4} alignItems="center">

        <Grid item>
          <Typography variant="h3" component="h2">
            Create a Profile
          </Typography>
        </Grid>

        <Grid item>
          <TextField
            select
            label="Category"
            variant="outlined"
            className={classes.inputBox}
            value={signupDetails.type}
            onChange={(event) => handleInput("type", event.target.value)}
          >
            <MenuItem value="applicant">Applicant</MenuItem>
            <MenuItem value="recruiter">Recruiter</MenuItem>
          </TextField>
        </Grid>

        <Grid item>
          <TextField
            label="Name"
            value={signupDetails.name}
            onChange={(event) => handleInput("name", event.target.value)}
            className={classes.inputBox}
            error={inputErrorHandler.name.error}
            helperText={inputErrorHandler.name.message}
            onBlur={(event) => {
              if (event.target.value === "") {
                handleInputError("name", true, "Name is required");
              } else {
                handleInputError("name", false, "");
              }
            }}
            variant="outlined"
          />
        </Grid>

        <Grid item>
          <EmailInput
            label="Email"
            value={signupDetails.email}
            onChange={(event) => handleInput("email", event.target.value)}
            inputErrorHandler={inputErrorHandler}
            handleInputError={handleInputError}
            className={classes.inputBox}
            required={true}
          />
        </Grid>

        <Grid item>
          <PasswordInput
            label="Password"
            value={signupDetails.password}
            onChange={(event) => handleInput("password", event.target.value)}
            className={classes.inputBox}
            error={inputErrorHandler.password.error}
            helperText={inputErrorHandler.password.message}
            onBlur={(event) => {
              if (event.target.value === "") {
                handleInputError("password", true, "Password is required");
              } else {
                handleInputError("password", false, "");
              }
            }}
          />
        </Grid>

        {signupDetails.type === "applicant" ? (
          <>
            <EducationSection
              education={education}
              setEducation={setEducation}
            />

            <ExperienceSection
              experience={experience}
              setExperience={setExperience}
            />

            <Grid item>
              <ChipInput
                className={classes.inputBox}
                label="Skills"
                variant="outlined"
                helperText="Press enter to add skills"
                onChange={(chips) => setSignupDetails({ ...signupDetails, skills: chips })
                }
              />
            </Grid>
          </>
        ) : (
          <>
            <Grid item style={{ width: "100%" }}>
              <TextField
                label="Bio (upto 250 words)"
                multiline
                minRows={8}
                style={{ width: "100%" }}
                variant="outlined"
                value={signupDetails.bio}
                onChange={(event) => {
                  if (
                    event.target.value.split(" ").filter(function (n) {
                      return n != "";
                    }).length <= 250
                  ) {
                    handleInput("bio", event.target.value);
                  }
                }}
              />
            </Grid>
            <Grid item>
              <PhoneInput
                country={"gb"}
                value={phone}
                onChange={(phone) => setPhone(phone)}
              />
            </Grid>
          </>
        )}

        <Grid item>
          <Button
            variant="contained"
            style={{ backgroundColor: 'green', color: 'white' }}
            onClick={() => {
              signupDetails.type === "applicant"
                ? handleLogin()
                : handleLoginRecruiter();
            }}
            className={classes.submitButton}
          >
            Signup
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Register;