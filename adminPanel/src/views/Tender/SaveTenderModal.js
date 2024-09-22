import React, { useEffect, useState, useRef } from "react";
import { Button, Modal } from "reactstrap";
import {
  Card,
  CardBody,
  CardTitle,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { X, CheckSquare } from "react-feather";
import Toast from "../alert/Toast";
import { billingApiServices } from "../../services/BillingApiService";
import { localStorageService } from "../../services/LocalStorageService";
import { InputTextarea } from "primereact/inputtextarea";
import "./SaveModal.css"; // Import your CSS file
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";
import { Skeleton } from "primereact/skeleton";
import { Calendar } from "primereact/calendar";

//for plus buttons
import SaveOrganizationModal from "./../organizations/SaveOrganizationModal";
import SaveCategoryModal from "./../Categories/SaveCategoryModal";
import SaveNewsPaperModal from "./../NewsPaper/SaveNewsPaperModal";
import SaveCityModal from "../CityManagement/SaveCityModal";
// for plus buttons


import { MultiSelect } from "primereact/multiselect";
import moment from "moment";
import _EventEmitter from "../../constants/emitter";
import { Watermark } from "@hirohe/react-watermark";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import CategorySelection from "./CategorySelection";
import { utils } from "../../utility";
import imageCompression from 'browser-image-compression';

const SaveTenderModal = (props) => {
  const [modal, setModal] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setErrors] = useState(false);
  const [severity, setSeverity] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");
  const _userData = localStorageService.getPersistedData("USER_DETAILS");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);
  const [IplNumber, setIplNumber] = useState("");
  const [title, setTitle] = useState("");
  const [openDate, setOpenDate] = useState(null);
  const [publishDate, setPublishDate] = useState(new Date());
  const [OrganizationDetails, setOrganizationDetails] = useState([
    {},
    {},
    {},
    {},
    {},
    {},
  ]);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [CategoryDetails, setCategoryDetails] = useState([
    {},
    {},
    {},
    {},
    {},
    {},
  ]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [NewsPaperDetails, setNewsPaperDetails] = useState([
    {},
    {},
    {},
    {},
    {},
    {},
  ]);
  const [selectedNewsPaper, setSelectedNewsPaper] = useState(null);
  const [CityDetails, setCityDetails] = useState([{}, {}, {}, {}, {}, {}]);
  const [selectedCity, setSelectedCity] = useState(null);

  // for plus buttons
  const [categoryModal, setCategoryModal] = useState(false);
  const [organizationModal, setOrganizationModal] = useState(false);
  const [newspaperModel, setNewsPaperModel] = useState(false);
  const [cityModel, setcityModel] = useState(false);
  // for plus buttons


  const [organizationLoader, setOrganizationLoader] = useState(false);
  const [newsPaperLoader, setnewsPaperLoader] = useState(false);


  const [imgPath, setImgPath] = useState("");
  const [Loader, setLoader] = useState(false);
  const [IPLError, setIPLError] = useState("");
  const [isFooterDisabled, setIsFooterDisabled] = useState(false);
  const [refreshFileInput, setRefreshFileInput] = useState(false);
  const [savedImageName, setSavedImageName] = useState("");

  const gridRef = useRef(null);

  const dropdownRef = useRef(null);
  const IPLRef = useRef(null);
  const filterOrganizationRef = useRef(null);

  const [zoom, setZoom] = useState(1);

  const [customTitle, setCustomTitle] = useState(""); // New state for user-provided title


  const handleZoomIn = () => {
    // setZoom(zoom + 0.1);
  };

  const handleZoomOut = () => {
    if (zoom == 1.7) {
      setZoom(1);
    } else {
      setZoom(1.7);
    }
  };

  const handleOff = () => {
    setSelectedCategory(null);
  };

  const dropdownOptions = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3" },
  ];




  // for plus buttons
  useEffect(() => {


    const reloadOrg = (data) => {
      let dt = props.OrganizationDetails;
      dt.push(data[0]);
      setOrganizationDetails(dt);
      setOrganizationLoader(false);
    };

    const reloadCategory = (data) => {
      let dt = props.CategoryDetails;
      dt.push(data[0]);
      setCategoryDetails(dt);
      
    };

    const reloadNewspaper = (data) => {
      let dt = props.newsPaperDetails;
      dt.push(data[0]);
      setNewsPaperDetails(dt);
      setnewsPaperLoader(false);
    }


    const reloadCitie = (data) => {
      let dt = props.cityDetails;
      dt.push(data[0]);
      setCityDetails(dt);
    };
    _EventEmitter.on("reloadOrganizations", reloadOrg);
    _EventEmitter.on("reloadCategories", reloadCategory);
    _EventEmitter.on("reloadCities", reloadCitie);
    _EventEmitter.on("reloadNewspapers", reloadNewspaper);

    if (!props.OrganizationLoader) {
      setOrganizationLoader(false);
      setOrganizationDetails(props.OrganizationDetails);
    }

    if (props.modalopen) {
      setModal(true);
    }

    if (!props.CategoryLoader) {
      setCategoryDetails(props.CategoryDetails);
    }

    if (!props.newsPaperLoader) {
      setNewsPaperDetails(props.newsPaperDetails);
    }

    if (!props.cityLoader) {
      setCityDetails(props.cityDetails);
    }
  }, [props.modalopen,
  props.OrganizationLoader,
  props.OrganizationDetails,
  props.CategoryLoader,
  props.CategoryDetails,
  props.newsPaperLoader,
  props.newsPaperDetails,
  props.cityLoader,
  props.cityDetails,
  ]);
  // for plus buttons



  const toggle = () => {
    setModal(false);
    props.onClose();
    // if (!props.isEditMode) {
    //   props.showModal.getShowModal(!modal);
    // }
  };

  // useEffect(() => {
  //   if (props.dataForEdit != null && props.isEditMode) {
  //     setIsFooterDisabled(true);
  //     setIplNumber(props.dataForEdit?.IPLNumber);
  //     setTitle(props.dataForEdit?.name);
  //     setSavedImageName(props.dataForEdit?.tenderImage);
  //     let categories = props.dataForEdit?.category?.split(":");
  //     var selectedItem = [];
  //     categories?.forEach((element) => {
  //       let dt = props.CategoryDetails?.find(
  //         (c) => c.name?.toLowerCase() == element?.toLowerCase()
  //       );
  //       if (dt != null && dt != undefined) {
  //         selectedItem.push(dt);
  //       }
  //     });
  //     setSelectedCategory(selectedItem);

  //     let _selectedCity = props.cityDetails?.find(
  //       (c) => c.id == props.dataForEdit?.city
  //     );
  //     if (_selectedCity != null && _selectedCity != undefined) {
  //       setSelectedCity(_selectedCity);
  //     }

  //     let _selectedNewspaper = props.newsPaperDetails?.find(
  //       (c) => c.id == props.dataForEdit?.newspaper
  //     );
  //     setSelectedNewsPaper(_selectedNewspaper);

  //     let _selectedOrganization = props.OrganizationDetails?.find(
  //       (c) => c.id == props.dataForEdit?.organization
  //     );
  //     setSelectedOrganization(_selectedOrganization);

  //     setOpenDate(props.dataForEdit?.openDate);
  //     const formattedDate = moment(props.dataForEdit?.publishDate)
  //       .utcOffset("+05:00")
  //       .format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ (z)");

  //     setPublishDate(new Date(props.dataForEdit?.publishDate));
  //     // setSelectedFile(props.dataForEdit?.tenderImage)
  //     setSelectedImg(props.dataForEdit?.tenderImage);
  //   }
  // }, [props.dataForEdit, props.CategoryDetails, props.cityDetails, props.newsPaperDetails, props.OrganizationDetails]);



  useEffect(() => {
    if (props.dataForEdit != null && props.isEditMode) {
      setIsFooterDisabled(true);
      setIplNumber(props.dataForEdit?.IPLNumber);
      setTitle(props.dataForEdit?.name); // This is the full title with organization name
      setSavedImageName(props.dataForEdit?.tenderImage);
      let categories = props.dataForEdit?.category?.split(":");
      var selectedItem = [];
      categories?.forEach((element) => {
        let dt = props.CategoryDetails?.find(
          (c) => c.name?.toLowerCase() == element?.toLowerCase()
        );
        if (dt != null && dt != undefined) {
          selectedItem.push(dt);
        }
      });
      setSelectedCategory(selectedItem);
  
      let _selectedCity = props.cityDetails?.find(
        (c) => c.id == props.dataForEdit?.city
      );
      if (_selectedCity != null && _selectedCity != undefined) {
        setSelectedCity(_selectedCity);
      }
  
      let _selectedNewspaper = props.newsPaperDetails?.find(
        (c) => c.id == props.dataForEdit?.newspaper
      );
      setSelectedNewsPaper(_selectedNewspaper);
  
      let _selectedOrganization = props.OrganizationDetails?.find(
        (c) => c.id == props.dataForEdit?.organization
      );
      setSelectedOrganization(_selectedOrganization);
  
      // Separate the organization name from the custom title
      const orgName = _selectedOrganization?.name;
      const fullName = props.dataForEdit?.name;
      const cityName = _selectedCity?.name;
      
      if (fullName?.includes(" - ") && orgName && cityName) {
        const [userProvidedTitle] = fullName.split(" - ");
        setCustomTitle(userProvidedTitle || ""); // Set the user-provided title for editing
      } else {
        setCustomTitle(fullName || ""); // Fallback in case there's no separator
      }
  
      setOpenDate(props.dataForEdit?.openDate);
      const formattedDate = moment(props.dataForEdit?.publishDate)
        .utcOffset("+05:00")
        .format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ (z)");
  
      setPublishDate(new Date(props.dataForEdit?.publishDate));
      setSelectedImg(props.dataForEdit?.tenderImage);
    }
  }, [props.dataForEdit, props.CategoryDetails, props.cityDetails, props.newsPaperDetails, props.OrganizationDetails,props.isEditMode]);




  const SubmitForm = () => {
    if (isValid()) {
      if (props.isEditMode) {
        Edit();
      } else {
        save();
      }
    }
  };

  const convertImagetobase64 = (file, callback) => {
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const response = e.target.result;
        // Save or send the base64String to the server.
        callback(response);
      };

      reader.readAsDataURL(file);
    } else {
      callback(null); // Handle the case where no file is provided
    }
  };

  const Edit = async () => {
    var categories = selectedCategory?.map(v => v.name);

    if (savedImageName == "") {
      handleToast("error", "Tender not uploaded ,please do it again");
      return;
    }

    const body = {
      id: props.dataForEdit?.id,
      name: title,
      IPLNumber: IplNumber,
      openDate: moment(publishDate).format("YYYY-MM-DD HH:mm:ss"),
      pubLishDate: moment(publishDate).format("YYYY-MM-DD HH:mm:ss"),
      tenderImage: savedImageName,
      organization: selectedOrganization?.id,
      newsPaper: selectedNewsPaper?.id,
      category: categories?.join(":"),
      city: selectedCity?.id,
      effectedBy: _userData?.id,
    };

    billingApiServices.updateTender(body).then((response) => {
      if (response == null || response == undefined) {
        handleToast(
          "error",
          "Operation failed, check your internet connection"
        );
        return;
      }

      if (response?.data?.status) {
        handleToast("success", response?.data?.message);

        setTimeout(() => {
          props.reloadData();
          setModal(false);
          props.onClose();
          resetInput();
        }, 1000);
      } else {
        handleToast("error", response?.data?.message);
      }
    });
  };

  // const testImg = () => {
  //   var img = handleUpload("");
  //   if (img == false) {
  //     handleToast("error", "Operation failed, check your internet connection");
  //     return;
  //   }
  // };

  const save = async () => {
    if (savedImageName == "") {
      handleToast("error", "Tender not uploaded ,please do it again");
      return;
    }
    setLoader(true);

    const now = new Date();
    // Add 5 hours to the current date and time
    const newDate = new Date(now.getTime() + 5 * 60 * 60 * 1000);

    var categories = selectedCategory?.map((v) => v.name);
    const body = {
      name: title,
      IPLNumber: IplNumber,
      openDate: moment(publishDate).format("YYYY-MM-DD HH:mm:ss"),
      pubLishDate: moment(publishDate).format("YYYY-MM-DD HH:mm:ss"),
      tenderImage: savedImageName,
      organization: selectedOrganization?.id,
      newsPaper: selectedNewsPaper?.id,
      category: categories?.join(":"),
      city: selectedCity?.id,
      effectedBy: _userData?.id,
      effectedDate: moment(now).format("YYYY-MM-DD HH:mm:ss"),
    };

    billingApiServices.saveTender(body).then((response) => {
      if (response == null || response == undefined) {
        handleToast(
          "error",
          "Operation failed, check your internet connection"
        );
        return;
      }

      if (response?.data?.status) {
        setSavedImageName("");
        setRefreshFileInput(true);
        setTimeout(() => {
          setRefreshFileInput(false);
        }, 500);
        setLoader(false);
        handleToast("success", response?.data?.message);
        props.reloadData();
        setModal(false);
        props.onClose()
        resetInput();
      } else {
        handleToast("error", response?.data?.message);
      }
    });
  };

  const handleToast = (severity, message) => {
    _EventEmitter.emit("openToast", message + ":" + severity);
  };

  const resetInput = () => {
    setIplNumber("");
    setTitle("");
    setSelectedCategory(null);
    setSelectedCity(null);
    setSelectedNewsPaper(null)
    setSelectedOrganization(null);
    setOpenDate(null);
    setSelectedFile(null);
    setSelectedImg(null);
  };
  const isValid = () => {
    if (IplNumber?.trim() == "") {
      setErrors(true);
      return false;
    } else if (title?.trim() == "") {
      setErrors(true);
      return false;
    }
    else if (selectedCategory == null) {
      setErrors(true)
      return false
    }
    else if (selectedOrganization == null) {
      setErrors(true);
      return false;
    } else if (selectedCity == null) {
      setErrors(true);
      return false;
    } else if (selectedNewsPaper == null) {
      setErrors(true);
      return false;
    } else if (publishDate == null) {
      setErrors(true);
      return false;
    } else if (selectedFile == null && !props.isEditMode) {
      setErrors(true);
      return false;
    }
    return true;
  };

  const handleQuestion = (e) => {
    setQuestion(e.target.value);
    setErrors(false);
  };

  const handleAnswer = (e) => {
    setAnswer(e.target.value);
    setErrors(false);
  };

  const handleFileChange = async (event) => {
    setSavedImageName("");

  

    try {
      let file = URL.createObjectURL(event.target.files[0]);
      setSelectedImg(file);
      setSelectedFile(event.target.files[0]);

      var result = false;

      const fileExtension = event.target.files[0]?.name?.split(".").pop();
      var name =
        "tender786-" +
        utils.generateRandomId() +
        "." +
        fileExtension?.toLowerCase();

      var response = await billingApiServices.uploadFile(
        event.target.files[0],
        name
      );
      if (response?.status) {
        setSavedImageName("https://mytender.online/uploads/" + name);
        setSavedImageName("http://localhost:5000/uploads/" + name);

      } else {
        setSavedImageName("");
        alert("Error while uploading image , please try again");
      }

      console.log("****", result);
      return result;
    } catch (error) {
      setSavedImageName("");
      console.log("image error :" + error);
      alert("Error while uploading image , please try again");
    }
  };

  // const handleFileChange = async (event) => {
  //   setSavedImageName("");
  
  //   try {
  //     let file = event.target.files[0];
  //     const fileExtension = file?.name?.split(".").pop();
  //     var name = "tender786-" + utils.generateRandomId() + "." + fileExtension?.toLowerCase();
  
  //     // Function to add the watermark "Tender 786 Bismillah" to the image
  //     const addWatermark = async (file) => {
  //       return new Promise((resolve) => {
  //         const reader = new FileReader();
  //         reader.readAsDataURL(file);
  //         reader.onload = function (e) {
  //           const img = new Image();
  //           img.src = e.target.result;
  //           img.onload = function () {
  //             // Create a canvas to draw the image and watermark
  //             const canvas = document.createElement("canvas");
  //             const ctx = canvas.getContext("2d");
  
  //             canvas.width = img.width;
  //             canvas.height = img.height;
  
  //             // Draw the original image on the canvas
  //             ctx.drawImage(img, 0, 0);
  
  //             // Set watermark style
  //             const fontSize = img.width / 20; // Dynamically set font size based on image width
  //             ctx.font = `${fontSize}px Arial`;
  //             ctx.fillStyle = "rgba(255, 0, 0, 0.3)"; // Red color with 30% transparency
  //             ctx.textAlign = "center";
  
  //             const watermarkText = "Tender 786 Bismillah";
  //             const textWidth = ctx.measureText(watermarkText).width;
  
  //             // Repeat watermark across the X-axis and Y-axis
  //             for (let y = 50; y < canvas.height; y += fontSize * 2) {
  //               for (let x = 0; x < canvas.width; x += textWidth + 20) {
  //                 ctx.fillText(watermarkText, x, y);
  //               }
  //             }
  
  //             // Convert canvas to a blob (to get file format and size)
  //             canvas.toBlob((blob) => {
  //               resolve(blob);
  //             }, file.type);
  //           };
  //         };
  //       });
  //     };
  
  //     // Function to ensure the image is compressed to 500KB or less
  //     const compressImageTo500KB = async (file) => {
  //       let compressedFile = file;
  //       let sizeInMB = file.size / 1024 / 1024; // convert to MB
  
  //       // Set a base option to start compression
  //       let options = {
  //         maxSizeMB: sizeInMB, // Start with the current size of the image
  //         useWebWorker: true,
  //         maxWidthOrHeight: 1920, // Set max resolution (to help with compression)
  //       };
  
  //       // Keep compressing until the file size is <= 500KB
  //       while (compressedFile.size > 500 * 1024) { // 500KB in bytes
  //         compressedFile = await imageCompression(compressedFile, options);
  //         // Reduce maxSizeMB further if still larger than 500KB
  //         options.maxSizeMB = options.maxSizeMB / 2;
  //       }
  
  //       return compressedFile;
  //     };
  
  //     // First, add the watermark to the image
  //     const watermarkedFileBlob = await addWatermark(file);
  
  //     // Convert the watermarked Blob back to a File object (so it can be compressed)
  //     const watermarkedFile = new File([watermarkedFileBlob], file.name, { type: file.type });
  
  //     // Compress the watermarked image to 500KB or less
  //     const compressedFile = await compressImageTo500KB(watermarkedFile);
  
  //     // Create an object URL for the compressed file
  //     let compressedFileUrl = URL.createObjectURL(compressedFile);
  //     setSelectedImg(compressedFileUrl);
  //     setSelectedFile(compressedFile);
  
  //     // Upload the compressed file
  //     var response = await billingApiServices.uploadFile(compressedFile, name);
  //     if (response?.status) {
  //       setSavedImageName("https://mytender.online/uploads/" + name);
  //       setSavedImageName("http://localhost:5000/uploads/" + name);
  //     } else {
  //       setSavedImageName("");
  //       alert("Error while uploading image, please try again");
  //     }
  
  //     return true;
  //   } catch (error) {
  //     setSavedImageName("");
  //     console.log("image error :" + error);
  //     alert("Error while uploading image, please try again");
  //   }
  // };
  // const handleUpload = async (id) => {
  //   var result = false;
  //   var _blob = null;
  //   const canvas = await html2canvas(gridRef.current);

  //   const blob = await new Promise((resolve) => {
  //     canvas.toBlob((blob) => {
  //       resolve(blob);
  //     });
  //   });

  //   const fileExtension = selectedFile?.name?.split(".").pop();
  //   var imgTitle = title?.trim()?.split(" ").join("-");
  //   var name = imgTitle + "-" + id + "." + fileExtension?.toLowerCase();

  //   var response = await billingApiServices.uploadFile(blob, name);
  //   if (response?.status) {
  //     result = name;
  //   } else {
  //     result = false;
  //   }

  //   return result;
  // };

  const handleIplNumber = (e) => {
    var response = props.gridData?.filter(
      (x) => x.IPLNumber?.toString() == e.target.value
    );
    if (response?.length > 0 && !props.isEditMode) {
      setIPLError("* Already exists");
    } else if (
      response?.length > 0 &&
      !props.isEditMode &&
      props.dataForEdit?.IPLNumber != e.target.value
    ) {
      setIPLError("* Already exists");
    } else {
      setIPLError("");
    }
    setIplNumber(e.target.value);
  };

  // const handleTitle = (e) => {
  //   var value = e.target.value;
  //   const regex = /^[a-zA-Z0-9_ -]*$/;

  //   if (!regex.test(value)) {
  //     // Remove the last character if it's not allowed
  //     value = value.slice(0, -1);
  //   }

  //   setTitle(value);
  // };

  // Function to handle user input for the title
// const handleTitle = (e) => {
//   const value = e.target.value;
//   const regex = /^[a-zA-Z0-9_ -]*$/;

//   if (!regex.test(value)) {
//     // Remove the last character if it's not allowed
//     return;
//   }

//   setCustomTitle(value);

//   if (selectedOrganization) {
//     // Combine organization name with custom title
//     setTitle(`${value} - ${selectedOrganization.name}`);

//     if(selectedOrganization && selectedCity){
//     setTitle(`${value} - ${selectedOrganization.name} - ${selectedCity.name}`);
//     }

//   } else {
//     setTitle(value); // If no organization is selected, just set the user input as the title
//   }
// };

const handleTitle = (e) => {
  const value = e.target.value;
  const regex = /^[a-zA-Z0-9_ -]*$/;

  if (!regex.test(value)) {
    // If invalid characters are entered, ignore them
    return;
  }

  setCustomTitle(value);

  // Update the combined title with custom title, organization, and city
  updateCombinedTitle(value, selectedOrganization, selectedCity);
};


  const dropdownRefSpaceBar = useRef(null);

  // const handleOrganization = (e) => {
  //   onOrganzationClick();
  //   setSelectedOrganization(e.value);
  // };

  // const handleOrganization = (e) => {
  //   const organization = e.value;
  //   setSelectedOrganization(organization);
  
  //   // Combine organization name with custom title
  //   if (customTitle && selectedCity==null ) {
  //     setTitle(`${customTitle} - ${organization.name} - ${selectedCity.name}`);
  //   } else {
  //     setTitle(`${organization.name}`); // If no custom title, just use the organization name
  //   }
  // };
  
  // Function to handle organization selection and update the title
const handleOrganization = (e) => {
  const organization = e.value;
  setSelectedOrganization(organization);

  // Update the combined title with custom title, organization, and city
  updateCombinedTitle(customTitle, organization, selectedCity);
};

  // const handleCity = (e) => {
  //   const city = e.value;
  //   setSelectedCity(city);
  
  //   // Combine organization name, city name, and custom title
  //   if (customTitle && selectedOrganization ) {
  //     setTitle(`${customTitle} - ${selectedOrganization.name} - ${selectedCity.name}`);
  //   }else {
  //     setTitle(`${city.name}`);
  //   }
  // };



  // Function to handle city selection and update the title


const handleCity = (e) => {
  const city = e.value;
  setSelectedCity(city);

  // Update the combined title with custom title, organization, and city
  updateCombinedTitle(customTitle, selectedOrganization, city);
};

// Function to combine and set the title dynamically
const updateCombinedTitle = (customTitle, organization, city) => {
  let combinedTitle = "";

  if (customTitle) combinedTitle += customTitle; // Add custom title if present
  if (organization) combinedTitle += ` - ${organization.name}`; // Add organization name
  if (city) combinedTitle += ` - ${city.name}`; // Add city name

  setTitle(combinedTitle); // Set the combined title
};  

  const handleCategory = (e) => {
    onCategoryClick();
    setSelectedCategory(e.value);
  };

  const organizationTemplate = (row) => {
    if (organizationLoader) {
      return <Skeleton></Skeleton>;
    }

    return <>{row.name}</>;
  };

  const categoryTemplate = (row) => {
    if (props.CategoryLoader) {
      return <Skeleton></Skeleton>;
    }

    return <>{row.name}</>;
  };

  const NewsPaperTemplate = (row) => {
    if (props.newsPaperLoader) {
      return <Skeleton></Skeleton>;
    }

    return <>{row.name}</>;
  };

  const cityTemplate = (row) => {
    if (props.cityLoader) {
      return <Skeleton></Skeleton>;
    }

    return <>{row.name}</>;
  };


  // for plus buttons
  const addOrganization = () => {
    setOrganizationModal(true);
  };

  const addNewspaper = () => {
    setNewsPaperModel(true);
  }


  const addCategory = () => {
    setCategoryModal(true);

  };
  const addCities = () => {
    setcityModel(true);

  };
  // for plus buttons


  // For plus button reload the data after adding
  const reloadOrganizations = () => {
    //setOrganizationLoader(true)
    props.reloadOrganizations()
  };

  const reloadCities = () => {
    props.reloadCities();
  }

  const reloadNewspapers = () => {
    //setnewsPaperLoader(true);
    props.reloadNewspapers()
  };

  // For plus button reload the data after adding




  const getSelectedItems = (items) => {
    setSelectedCategory(items);
  };

  useEffect(() => {
    IPLRef?.current?.focus();
  }, [selectedImg]);

  const onOrganzationClick = () => {
    document.querySelector("#organization-dropdown input").focus();
  };

  const onNewsPaperClick = () => {
    document.querySelector("#newspaper-dropdown input").focus();
  };

  const onCityClick = () => {
    document.querySelector("#city-dropdown input").focus();
  };
  const onCategoryClick =()=>{
    document.querySelector("#category-dropdown input").focus();
  };

  return (
    <div className="container-fluid d-flex justify-content-start mt-2" style={{ overflow: "auto" }}>
      <Toast
        open={openSnackBar}
        severity={severity}
        handleClose={() => setOpenSnackBar(false)}
        message={responseMsg}
      />

      <div className="modal-lg" role="document">
        <div className="modal-content modal-content__">
          <div className="grid-container" style={{ alignItems: "start" }}>
            <div
              className="section col4"
              style={{ position: "sticky", top: 0 }}
            >
              <div className="p-grid p-fluid">
                <div className="p-col-12">
                  <span>IPL Number :</span>
                  {IplNumber?.trim() == "" && (
                    <span className="validation-error">* Required</span>
                  )}
                  <span className="validation-error">{IPLError}</span>
                  <InputText
                    type="text"
                    value={IplNumber}
                    onChange={(e) => handleIplNumber(e)}
                    className="ipl-input"
                    ref={IPLRef}
                  />
                </div>


                {/* Title */}
                <div className="p-col-12" style={{ display: "flex", flexDirection: "column", }}>
                  <span>
                    Title :{" "}
                    {title?.trim() == "" && (
                      <span className="validation-error">* Required</span>
                    )}
                  </span>
                  <InputText
                    type="text"
                    //value={title}
                    value={customTitle} // Bind the input field to customTitle
                    onChange={(e) => handleTitle(e)}
                    className="ipl-input"
                  />
                </div>
                {/* Title */}


                      {/* Organization dropdown */}
                {/* <div className="p-col-12">

                  <span>

                    Organization:{" "}
                    <span
                      class="add-minus-btn"
                      onClick={() => addOrganization()}
                    >
                      <i className="fa fa-plus-circle"></i>

                      {selectedOrganization == null && (
                        <span className="validation-error">* Required</span>
                      )}
                    </span>

                  </span>
                  <Dropdown
                    id="organization-dropdown"
                    options={OrganizationDetails}
                    itemTemplate={(e) => organizationTemplate(e)}
                    filter
                    filterBy="name"
                    filterPlaceholder="Search"
                    onChange={(e) => handleOrganization(e)}
                    optionLabel="name"
                    value={selectedOrganization}
                    placeholder="Select an Organziation"
                    resetFilterOnHide={true}
                  />
                </div> */}
                      {/* Organization dropdown */}

    {/* Organization dropdown */}
    <div className="p-col-12">
      <span>
        Organization:{" "}
        <span class="add-minus-btn" onClick={() => addOrganization()}>
          <i className="fa fa-plus-circle"></i>
          {selectedOrganization == null && (
            <span className="validation-error">* Required</span>
          )}
        </span>
      </span>
      <Dropdown
        id="organization-dropdown"
        options={OrganizationDetails}
        itemTemplate={(e) => organizationTemplate(e)}
        filter
        filterBy="name"
        filterPlaceholder="Search"
        onChange={(e) => handleOrganization(e)}
        optionLabel="name"
        value={selectedOrganization}
        placeholder="Select an Organization"
        resetFilterOnHide={true}
      />
    </div>
    {/* Organization dropdown */}



                <div className="p-col-12">
                  <span className=" d-flex mt-2 ">

                    Category:

                    {/* Plus button */}
                    <span
                      className="add-minus-btn"
                      onClick={() => addCategory()}
                    >
                      <i className="fa fa-plus-circle"></i>
                    </span>
                    {/* Plus button */}
                   
                    {selectedCategory==null &&(
                      <span className="validation-error">* Required</span>
                    )}

                  </span>
                    <CategorySelection
                    CategoryDetails={CategoryDetails}
                    getSelectedItems={(items) => getSelectedItems(items)}
                    preSelectedCategories={selectedCategory}  // Pass the pre-selected categories here
                  />
                  
                    {/* <Dropdown
                    id="category-dropdown"
                    options={CategoryDetails}
                    itemTemplate={(e) => categoryTemplate(e)}
                    filter
                    filterBy="name"
                    filterPlaceholder="Search"
                    onChange={(e) => handleCategory(e)}
                    optionLabel="name"
                    value={selectedCategory}
                    placeholder="Select Category"
                    resetFilterOnHide={true}
                  /> */}

                 
                </div>

                <div className="p-col-12">

                  <span>
                    News Paper:{" "}

                    {/* Plus button */}
                    <span
                      className="add-minus-btn"
                      onClick={() => addNewspaper()}
                    > <i className="fa fa-plus-circle"></i></span>
                    {/* Plus button */}



                    {selectedNewsPaper == null && (
                      <span className="validation-error">* Required</span>
                    )}
                  </span>

                  <Dropdown
                    id="newspaper-dropdown"
                    options={NewsPaperDetails}
                    itemTemplate={(e) => NewsPaperTemplate(e)}
                    onChange={(e) => {
                      onNewsPaperClick();
                      setSelectedNewsPaper(e.value);

                    }}
                    optionLabel="name"
                    filter
                    filterBy="name"
                    filterPlaceholder="Search"
                    value={selectedNewsPaper}
                    placeholder="Select News Paper"
                    resetFilterOnHide={true}
                  />
                </div>

                <div className="p-col-12">
                  <span>
                    City:{" "}

                    {/* Plus button */}
                    <span
                      className="add-minus-btn"
                      onClick={() => addCities()}
                    > <i className="fa fa-plus-circle"></i></span>
                    {/* Plus button */}



                    {selectedCity == null && (
                      <span className="validation-error">* Required</span>
                    )}
                  </span>
                  <Dropdown
                    id="city-dropdown"
                    options={CityDetails}
                    itemTemplate={(e) => cityTemplate(e)}
                    // onChange={(e) => {
                    //   onCityClick();
                    //   setSelectedCity(e.value);
                    // }}
                    onChange={(e) => handleCity (e)}
                    optionLabel="name"
                    filter
                    filterBy="name"
                    filterPlaceholder="Search"
                    value={selectedCity}
                    placeholder="Select City"
                    resetFilterOnHide={true}
                  />
                </div>

            

                <div className="p-col-12">
                  <span>
                    Submit/End Date:{" "}
                    {publishDate == null && (
                      <span className="validation-error">* Required</span>
                    )}
                  </span>
                  <div className="card flex justify-content-center">
                    <Calendar
                      value={publishDate}
                      format="DD/MM/YYYY"
                      onChange={(e) => setPublishDate(e.value)}
                    />
                  </div>
                </div>

                {refreshFileInput ? (
                  ""
                ) : (
                  <div className="p-col-12">
                    <span>
                      File:{" "}

{savedImageName != "" ? (
  <span className="validation-succes">File Saved!</span>

) : (
<span className="validation-error">* Required</span>

)}


                    </span>
                    <InputText
                      type="file"
                      onChange={(e) => handleFileChange(e)}
                      className="ipl-input"
                    // ref={dropdownRef}
                    />
                  </div>
                )}

                <br />
                <div className="p-col-12">
                  {Loader && "Uploading..."}
                  <div style={{ float: "right", marginTop: "15px" }}>
                    <button
                      id="new-report"
                      className="btn-style"
                      onClick={() => SubmitForm()}
                    >
                      {" "}
                      Save
                    </button>

                    <button
                      id="new-report"
                      className="btn-style cancel-btn"
                      onClick={() => props.onClose()}
                    >
                      {" "}
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>


      <div className="section_____img section col8" ref={gridRef}>
       
        <div className="content " style={{ overflow: 'auto' }}>
          <Watermark
            text="Tender786 Bismillah"
            textColor="rgba(255, 255, 255, 0.3)"
            textSize="10px"
        
          >
            <div style={{ overflow: 'auto', width: '100%', height: '100%', position: 'relative' }}>
              <img
                alt=""
                height="700px"
                src={selectedImg}
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: 'top left',
                  cursor: 'zoom-in',
                  zIndex: 0, // Image stays below the watermark
                }}
                onClick={handleZoomIn}
                onContextMenu={(e) => {
                  e.preventDefault(); // Prevent context menu on right-click
                  handleZoomOut();
                }}
              />
            </div>
          </Watermark>
        </div>

        <div className="p-col-12 mt-5">
          <h2
            style={{
              fontSize: '22px',
              fontWeight: 500,
              color: 'red',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {`©  ${selectedNewsPaper?.name} , ${selectedCity?.name} , ${moment(new Date()).format('YYYY-MM-DD')}`}
          </h2>
        </div>
      </div>


      {/* Models for plus button */}
      {organizationModal && (
        <SaveOrganizationModal
          modalopen={organizationModal}
          isEditMode={false}
          onClose={() => setOrganizationModal(false)}
          reloadData={() => reloadOrganizations()}
        />
      )}

      {newspaperModel && (
        <SaveNewsPaperModal
          modalopen={newspaperModel}
          isEditMode={false}
          onClose={() => setNewsPaperModel(false)}
          reloadData={() => reloadNewspapers()} // Fixed here
        />
      )}
      {cityModel && (
        <SaveCityModal
          modalopen={cityModel}
          isEditMode={false}
          onClose={() => setcityModel(false)}
          reloadData={() => reloadCities()}
        />
      )}



      {categoryModal && (
        <SaveCategoryModal
          modalopen={categoryModal}
          isEditMode={false}
          onClose={() => setCategoryModal(false)}
          reloadData={() => props.reloadCategories()}
        />
      )}

      {/* Models for plus button */}

    </div>
  );
};

export default SaveTenderModal;


  // if (title?.trim() == "") {
    //   event.preventDefault();
    //   setRefreshFileInput(true);
    //   setTimeout(() => {
    //     setRefreshFileInput();
    //   }, 1000);

    //   alert("Please enter the title before image selection");
    //   return;
    // }


 


   // filterInputAutoFocus={false}
                    // focusInputRef={true}
                    // showOnFocus={true}



    // {/* <div className="p-col-12">
    //                 <span>Open Date:</span>
    //                 <div className="card flex justify-content-center">
    //                   <Calendar value={openDate} onChange={(e) => {
    //                     console.log(e.value)
    //                     setOpenDate(e.value)
    //                   }} />
    //                   {openDate == null && <span className="validation-error">* Required</span>} 
    //                 </div>
    //               </div> */}




  // style={{
          //   position: 'absolute',
          //   top: 0,
          //   left: -100,
          //   right: 0,
          //   bottom: 0,
          //   backgroundRepeat: 'repeat',
          //   backgroundSize: '100px 100px',
          //   zIndex: 1,
          //     }}





    // if (selectedFile != null) {
    //   var id = new Date()?.getSeconds()?.toString();
    //   img = await handleUpload(id);

    //   const fileExtension = selectedFile?.name?.split(".").pop();
    //   var imgTitle = title?.trim()?.split(" ").join("-");
    //   var name = imgTitle + "-" + id + "." + fileExtension?.toLowerCase();

    //   if (img == false) {
    //     handleToast(
    //       "error",
    //       "Operation failed, check your internet connection"
    //     );
    //     return;
    //   }
    //   img = "https://mytender.online/uploads/" + name;
    // }


            //  {/* water mark */}
            // {/* <div className="section_____img section col8" ref={gridRef}>
            //   <div className="content" style={{ overflow: 'auto' }}>
            //     <Watermark text='Tender786 Bismillah' textColor='white' textSize='10'>
            //       <div style={{ overflow: 'auto', width: '100%', height: '100%', textAlign: 'center' }}>
            //         <img
            //           alt=""
            //           height="700px"
            //           src={selectedImg}
            //           style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', cursor: 'zoom-in' }}
            //           onClick={handleZoomIn}  
            //           onContextMenu={(e) => {
            //             e.preventDefault(); // Prevent context menu on right-click
            //             handleZoomOut();
            //           }}
            //         />
            //       </div>
            //     </Watermark>
            //   </div>

            //   <div className="p-col-12">
            //     <h2 sx={{ fontSize: '22px', fontWeight: 500, color: 'red', display: 'flex', justifyContent: 'center' }}>{`© ${selectedNewsPaper?.name} ${selectedCity?.name} ${moment(new Date()).format("YYYY-MM-DD")}`}</h2>
            //   </div>
            // </div> */}

           
            // {/* <div className=" section col8">
            //    <span className="imgFile__">IMAGE FILE.</span>
            //   {selectedFile == null ? (
            //     <div
            //       className=" content-four single-box text-center append"
            //       ref={gridRef}
            //     >
            //       {selectedImg != "" && selectedImg != null && (
            //         <a className="link" href="javascript;">
            //           <img
            //             src={selectedImg}
            //             onClick={handleZoomIn}
            //             onContextMenu={(e) => {
            //               e.preventDefault(); // Prevent context menu on right-click
            //               handleZoomOut();
            //             }}
            //             style={{
            //               transform: `scale(${zoom})`,
            //               transformOrigin: "top left",
            //               cursor: "zoom-in",
            //             }}
            //             width="100%"
            //             height="100%"
            //             className="profile-img zooooom"
            //             alt="TenderImage"
            //             data-magnify-src=""
            //           />
            //         </a>
            //       )}
            //     </div>
            //   ) : (
            //     <>
            //       <div
            //         className="content-four single-box text-center append"
            //         style={{ overflow: "visible" }}
            //         ref={gridRef}
            //       >
            //         {selectedImg != "" && selectedImg != null && (
            //           <Watermark
            //             // multiline={true}
            //             // text="Tender786"
            //             // width="100%"
            //             // height="100%"
            //             // textColor="red"
            //             // textSize="20"
            //             text='Tender786 Bismillah' 
            //             textColor='green' 
            //             textSize='10'
            //             style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'visible' }}
                      
            //           >
            //           <img
            //             src={selectedImg}
            //             onClick={handleZoomIn}
            //             onContextMenu={(e) => {
            //               e.preventDefault(); // Prevent context menu on right-click
            //               handleZoomOut();
            //             }}
            //             style={{
            //               transform: `scale(${zoom})`,
            //               transformOrigin: "top left",
            //               cursor: "zoom-in",
            //               height: "100%",
            //               width: "100%",
            //               zIndex:"0"
            //             }}
            //             width="100%"
            //             height="100%"
            //             className="profile-img zooooom"
            //             alt="TenderImage"
            //             data-magnify-src=""
            //           />
            //           </Watermark>
            //         )}
            //         <div className="p-col-12">
            //           <h2
            //             className="footer-img"
            //             sx={{
            //               fontSize: "22px",
            //               fontWeight: 500,
            //               display: "flex",
            //               justifyContent: "center",
            //             }}
            //           >
            //             {selectedNewsPaper?.name === undefined
            //               ? null
            //               : `© ${selectedNewsPaper?.name} ${moment(
            //                   new Date()
            //                 ).format("YYYY-MM-DD")}`}
            //           </h2>
            //         </div>
            //       </div>
            //     </>
            //   )}
            // </div> */}




            // {/* water mark */}