import ContactModel from "../Model/contact.model.js";

export const AddContact = async (req, res) => {
  const { name, email, mobile_no, message,userData } = req.body;
  if (!name || !email || !mobile_no || !message || !userData){
    return res.status(400).send("All the Field are required");
  }
    try {
        const CreateContects=await ContactModel.create({
            name, email, mobile_no, message,userData
        })
        if(CreateContects){
            return res.status(200).send("Contect Created successfully")
        }
        else{
            return res.status(200).send("Contect not Created successfully")
        }
    } catch (error) {
        return res.status(200).json({error})
    }
};
export const GetContact = async (req, res) => {
    try {
      // Fetch all contacts
      const Contects = await ContactModel.find();
  
      // Check if contacts were fetched successfully
      if (Contects && Contects.length > 0) {
        return res.status(200).json({ Contect:Contects });
      } else {
        return res.status(200).send("No contacts found");
      }
    } catch (error) {
      // Send error response in case of failure
      return res.status(400).json({ error: error.message });
    }
  };

export const DeleteContact = async (req, res) => {
    const {_id}=req.params;
    try {
      // Fetch all contacts
      const Contects = await ContactModel.findByIdAndDelete({_id});
  
      // Check if contacts were fetched successfully
      if (Contects) {
        return res.status(200).send("contect Deleted successfully");
      } else {
        return res.status(400).send("No contacts found");
      }
    } catch (error) {
      // Send error response in case of failure
      return res.status(400).json({ error: error.message });
    }
  };
  
