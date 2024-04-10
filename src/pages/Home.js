import React, {useEffect, useState} from "react";
import {db} from "../firebase";
import {Button, Card, Grid, Container, Image} from "semantic-ui-react";
import {useNavigate} from "react-router-dom";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import ModalComp from "../components/ModalComp";
import Spinner from "../components/Spinner";


const Home = () => {
    const [platillos, setPlatillos] = useState([]);
    const [open, setOpen] = useState(false);
    const [platillo, setPlatillo] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        const unsub = onSnapshot(collection(db, "platillos"), (snapshot) =>{
            let list = [];
            snapshot.docs.forEach((doc) => {
                list.push({id: doc.id, ...doc.data()})
            });
            setPlatillos(list);
            setLoading(false);
        },
        (error) => {
            console.log(error);
        }
     );
     return () => {
        unsub();

     };


    }, []);

    if (loading) {
        return <Spinner />;
    }

    const handleModal = (item) => {
        setOpen(true);
        setPlatillo(item);
    };

    const handleDelete = async (id) => {
        if(window.confirm("estas seguro de querer eliminar este platillo?")) {
            try{
                setOpen(false);
                await deleteDoc(doc(db, "platillos", id));
                setPlatillos(platillos.filter((platillo) => platillo.id !== id));
            } catch (err) {
                console.log(err);
            }
        }
    };

    return(
        <Container>
            
                <Grid columns={3} stackable>
                    {platillos && platillos.map((item) => (
                        <Grid.Column key={item.id}>
                            <Card>
                                <Card.Content>
                                    <Image
                                        src={item.img}
                                        size="medium"
                                        style={{
                                            height: "150px",
                                            width: "150px",
                                            borderRadius: "50%",
                                        }}
                                    />
                                    <Card.Header style={{marginTop: "10px"}}>
                                        {item.name}
                                    </Card.Header>
                                    <Card.Description>{item.descripcion}</Card.Description>
                                </Card.Content>
                                <Card.Content extra>
                                    <div>
                                        <Button color="green" onClick={() => navigate(`/update/${item.id}`)}>Update</Button>
                                        <Button color="purple" onClick={() => handleModal(item)}>view</Button>
                                        {open && ( 
                                            <ModalComp
                                                open={open}
                                                setOpen={setOpen}
                                                handleDelete={handleDelete}
                                                {...platillo}
                                                />
                                        )}
                                    </div>
                                </Card.Content>
                            </Card>
                        </Grid.Column>
                    ))}
                </Grid>
            
        </Container>
        
    )
}

export default Home