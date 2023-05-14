import {
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  makeStyles
} from "@material-ui/core";
import axios from "axios";
import { jsPDF } from "jspdf";
import ChipInput from "material-ui-chip-input";
import { useContext, useEffect, useState } from "react";
import { imageUrl } from './docImage';

import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // padding: "30px",
  },
}));

const MultifieldInput = (props) => {
  const classes = useStyles();
  const { education, setEducation } = props;

  return (
    <>
      {education.map((obj, key) => (
        <Grid item container className={classes.inputBox} key={key}>
          <Grid item xs={6}>
            <TextField
              label={`Institution Name #${key + 1}`}
              value={education[key].institutionName}
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].institutionName = event.target.value;
                setEducation(newEdu);
              }}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={3}>
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
          <Grid item xs={3}>
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
      <Grid item style={{ alignSelf: "center" }}>
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

const MultifieldInput2 = (props) => {
  const classes = useStyles();
  const { experience, setExperience } = props;

  return (
    <>
      {experience.map((obj, key) => (
        <Grid
          item
          container
          className={classes.inputBox}
          key={key}
          // style={{ paddingLeft: 0, paddingRight: 0 }}
          spacing={1}
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
              style={{ marginBottom: 10 }}
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
      <Grid item style={{ alignSelf: "center" }}>
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

const Profile = (props) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);
  const [userData, setUserData] = useState();
  const [open, setOpen] = useState(false);

  const [profileDetails, setProfileDetails] = useState({
    name: "",
    education: [],
    experience: [],
    skills: [],
    resume: "",
    profile: "",
  });

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
    }
  ])

  const handleInput = (key, value) => {
    setProfileDetails({
      ...profileDetails,
      [key]: value,
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(apiList.user, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setProfileDetails(response.data);
        if (response.data.education.length > 0) {
          setEducation(
            response.data.education.map((edu) => ({
              institutionName: edu.institutionName ? edu.institutionName : "",
              startYear: edu.startYear ? edu.startYear : "",
              endYear: edu.endYear ? edu.endYear : "",
            }))
          );
        }

        if (response.data.experience.length > 0) {
          setExperience(
            response.data.experience.map((exe) => ({
              companyName: exe.companyName ? exe.companyName : "",
              from: exe.from ? exe.from : "",
              to: exe.to ? exe.to : "",
              position: exe.position ? exe.position : "",
            }))
          );
        }
      })
      .catch((err) => {
        console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const editDetails = () => {
    setOpen(true);
  };

  const handleUpdate = () => {
    console.log(education);

    let updatedDetails = {
      ...profileDetails,
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

    axios
      .put(apiList.user, updatedDetails, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        getData();
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        console.log(err.response);
      });
    setOpen(false);
  };



  const generatePDF = () => {
    const doc = new jsPDF();

    let img = imageUrl

    doc.addImage(img, 'PNG', 10, 10, 50, 50);

    doc.text(profileDetails.name, 20, 10);

    doc.text("Educational Details", 65, 65)
    doc.text("Work Experience", 65, 90)

    profileDetails.education.forEach((ed) => {
      doc.text(ed.institutionName, 65, 75);
    })
    profileDetails.education.forEach((ed) => {
      doc.text(ed.startYear.toString(), 95, 75);
    })
    profileDetails.education.forEach((ed) => {
      doc.text(ed.endYear.toString(), 125, 75);
    })
    profileDetails.experience.forEach((ex) => {
      doc.text(ex.companyName, 65, 100);
    })
    profileDetails.experience.forEach((ex) => {
      doc.text(ex.from.toString(), 95, 100);
    })
    profileDetails.experience.forEach((ex) => {
      doc.text(ex.to.toString(), 125, 100);
    })


    doc.save("resume.pdf");
  }


  return (
    <>
      <Grid
        container
        item
        direction="column"
        alignItems="center"
        style={{ padding: "30px", minHeight: "93vh" }}
      >
        <Grid item>
          <Typography variant="h2">Profile</Typography>
        </Grid>
        <Grid item xs>
          <Paper
            style={{
              padding: "20px",
              outline: "none",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Grid container direction="column" alignItems="stretch" spacing={3}>
              <Grid item>
                <TextField
                  label="Name"
                  value={profileDetails.name}
                  onChange={(event) => handleInput("name", event.target.value)}
                  className={classes.inputBox}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <MultifieldInput
                education={education}
                setEducation={setEducation}
              />
              <MultifieldInput2
                experience={experience}
                setExperience={setExperience}
              />
              <Grid item>
                <ChipInput
                  className={classes.inputBox}
                  label="Skills"
                  variant="outlined"
                  helperText="Press enter to add skills"
                  value={profileDetails.skills}
                  onAdd={(chip) =>
                    setProfileDetails({
                      ...profileDetails,
                      skills: [...profileDetails.skills, chip],
                    })
                  }
                  onDelete={(chip, index) => {
                    let skills = profileDetails.skills;
                    skills.splice(index, 1);
                    setProfileDetails({
                      ...profileDetails,
                      skills: skills,
                    });
                  }}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              style={{ padding: "10px 50px", marginTop: "30px" }}
              onClick={() => handleUpdate()}
            >
              Update Details
            </Button>
          </Paper>
        </Grid>
        <Button variant="contained" color="secondary" style={{ padding: "10px 50px", marginTop: "30px" }} onClick={() => generatePDF()}>Generate CV</Button>
      </Grid>
      {/* <Modal open={open} onClose={handleClose} className={classes.popupDialog}> */}

      {/* </Modal> */}
    </>
  );
};

export default Profile;
