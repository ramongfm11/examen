import React from 'react'
import { Modal, Header, Image, Button} from "semantic-ui-react";


const ModalComp = ({open, setOpen, img, name, descripcion, numId, precio, id, handleDelete}) => {
  return (
    <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open}>
        <Modal.Header>detalles nombre</Modal.Header>
        <Modal.Content image>
            <Image size="medium" src={img} wrapped />
            <Modal.Description>
                <Header>{name}</Header>
                <p>{numId}</p>
                <p>{descripcion}</p>
                <p>{precio}</p>
            </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
            <Button color="black" onClick={() => setOpen(false)}> Cancel </Button>
            <Button color="red" content="Delete" labelPosition='right' icon="checkmark" onClick={() => handleDelete(id)} Delete /> 
        </Modal.Actions>

    </Modal>
      

  )
}

export default ModalComp
