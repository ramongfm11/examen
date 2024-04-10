import React, { useEffect, useState } from "react";
import { Button, Form, Grid, Loader} from "semantic-ui-react";
import { storage, db } from "../firebase";
import {useParams, useNavigate} from "react-router-dom";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Timestamp, addDoc, collection, doc, getDoc, serverTimestamp, snapshotEqual, updateDoc } from "firebase/firestore";

const initialState = {
    name: "",
    numId:"",
    descripcion:"",
    precio:"",


}

const AddEditUser = () => {
    const [data, setData] = useState(initialState);
    const {name, numId, descripcion, precio} = data;
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const navigate = useNavigate();
    const {id} = useParams();

    useEffect(() => {
        id && getSinglePlatillo();
    }, [id])


    const getSinglePlatillo = async () => {
        const docRef = doc(db, "platillos", id);
        const snapshot = await getDoc(docRef);
        if(snapshot.exists()) {
            setData({ ...snapshot.data() });
        }
    };

    useEffect(() => {
        const uploadFile = () => {
            const name = new Date().getTime() + file.name;
            const storageRef = ref(storage, file.name);
            const uploadTask = uploadBytesResumable(storageRef, file);
            
            uploadTask.on("state_changed", (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress);
                switch (snapshot.state) {
                    case "paused":
                        console.log("upload is paused");
                        break;
                    case "running":
                        console.log("upload is running");
                        break;
                    default:
                        break;
                }
            },(error) =>{
                console.log(error);
            },
            () =>{
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setData((prev) => ({ ...prev, img: downloadURL}));
                });
            } 
        );
        };

        file && uploadFile();
    
    },[file]);

    const handleChange = (e) => {
        setData({ ...data,[e.target.name]: e.target.value});
    };

    const validate = () => {
        let errors = {};
        if (!name) {
            errors.name = " nombre es requerido"
        }
        if (!numId) {
            errors.numId = " numero de id es requerido"
        }
        if (!descripcion) {
            errors.descripcion = " descripcion es requerido"
        }
        if (!precio) {
            errors.precio = " precio es requerido"
        }

        return errors;

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let errors = validate();
        if(Object.keys(errors).length) return setErrors(errors);
        setIsSubmit(true);
        if (!id) {
            try {
                await addDoc(collection(db, "platillos"), {
                    ...data,
                    Timestamp: serverTimestamp()
                });
            }  catch (error) {
                console.log(error);
            }
           
        } else{
            try {
                await updateDoc(doc(db, "platillos", id), {
                    ...data,
                    Timestamp: serverTimestamp()
                });
            }  catch (error) {
                console.log(error);
            }

        }
           
            navigate("/");

    };


    return(
        <div>
            <Grid 
                centered verticalAlign="middle" 
                columns="3" 
                style={{height: "80vh"}}
            >
                <Grid.Row>
                    <Grid.Column textAlign="center">
                        <div>
                            {isSubmit ? <Loader active inline="centered" size="huge" />: (
                                <>
                                <h2>{id ? "Actualizar Platillo" : "Agregar Platillo"}</h2>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Input 
                                        label="Nombre"
                                        error={errors.name ? {content: errors.name}: null}
                                        placeHolder="Enter Name"
                                        name="name"
                                        onChange={handleChange}
                                        value={name}
                                        autoFocus
                                    />
                                    <Form.Input 
                                        label="Numero de Id"
                                        error={errors.numId ? {content: errors.numId}: null}
                                        placeHolder="Enter NumId"
                                        name="numId"
                                        onChange={handleChange}
                                        value={numId}
                                        
                                    />
                                    <Form.TextArea 
                                        label="Descripcion"
                                        error={errors.descripcion ? {content: errors.descripcion}: null}
                                        placeHolder="Enter Descripcion"
                                        name="descripcion"
                                        onChange={handleChange}
                                        value={descripcion}
                                        
                                    />
                                    <Form.Input 
                                        label="Precio"
                                        error={errors.precio ? {content: errors.precio}: null}
                                        placeHolder="Enter Precio"
                                        name="precio"
                                        onChange={handleChange}
                                        value={precio}
                                        
                                    />
                                    <Form.Input
                                        label="Upload"
                                        type="file"
                                        onChange={(e) => setFile(e.target.files[0])}
                                    />
                                    <Button primary type="submit" disabled={progress !== null && progress < 100}>
                                        submit
                                    </Button>
                                    
                                </Form>
                                </>
                            )}
                        </div>
                    </Grid.Column>
                </Grid.Row>

            </Grid>
        </div>
    );
};

export default AddEditUser