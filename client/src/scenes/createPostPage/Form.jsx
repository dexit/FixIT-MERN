import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  InputLabel,
} from "@mui/material";
import { Formik, Form } from "formik";
import Dropzone from "react-dropzone";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FlexBetween from "components/FlexBetween";
const CreatePostForm = () => {
  const userId = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.token);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const initialValues = {
    description: "",
    picturePath: "",
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("description", values.description);

      //daca schimbam poza,
      if (values.picturePath.name)
        formData.append("picturePath", values.picturePath.name);
      // daca schimbam orice dar nu poza
      else formData.append("picturePath", values.picturePath);

      const response = await fetch(
        `http://localhost:3001/posts/${userId}/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
        //"Content-Type": "application/json", asta imi dadea eroarea cu cors.
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        navigate(`/profile/${userId}`);
      } else {
        throw new Error("Error creating post");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        setFieldValue,
        handleSubmit,
      }) => (
        <Form>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          >
            <TextField
              label="description"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.description}
              name="description"
              error={
                Boolean(touched.description) && Boolean(errors.description)
              }
              helperText={touched.description && errors.description}
              sx={{ gridColumn: "span 4" }}
            />

            <InputLabel id="picture-label" sx={{ marginBottom: "-22px" }}>
              Profile Picture
            </InputLabel>
            <Box
              gridColumn="span 4"
              border={`1px solid ${palette.neutral.medium}`}
              borderRadius="5px"
              p="1rem"
              name="picturePath"
            >
              <Dropzone
                acceptedFiles=".jpg,.jpeg,.png"
                multiple={false}
                onDrop={(acceptedFiles) =>
                  setFieldValue("picturePath", acceptedFiles[0])
                }
              >
                {({ getRootProps, getInputProps }) => (
                  <Box
                    {...getRootProps()}
                    border={`2px dashed ${palette.primary.main}`}
                    p="1rem"
                    sx={{ "&:hover": { cursor: "pointer" } }}
                  >
                    {!values.picturePath.name ? (
                      <FlexBetween>
                        <Typography>{values.picturePath}</Typography>
                        <EditOutlinedIcon />
                      </FlexBetween>
                    ) : (
                      <FlexBetween>
                        <Typography>{values.picturePath.name}</Typography>
                        <EditOutlinedIcon />
                      </FlexBetween>
                    )}
                    <input {...getInputProps()} />
                  </Box>
                )}
              </Dropzone>
            </Box>

            <Box sx={{ gridColumn: "span 4", placeSelf: "center" }}>
              <Button
                fullWidth
                type="submit"
                sx={{
                  m: "0.5rem 0",
                  p: "1rem",
                  backgroundColor: palette.login.button,
                  color: palette.background.alt,
                  "&:hover": {
                    backgroundColor: palette.login.buttonHover,
                    color: palette.login.buttonTextHover,
                  },
                }}
              >
                Create Post
              </Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default CreatePostForm;