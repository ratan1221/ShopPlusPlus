import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";

function AddressCard({
    addressInfo,
    handleDeleteAddress,
    handleEditAddress,
    setCurrentSelectedAddress,
    selectedId, }) {
    return (
        <Card
            onClick={
                setCurrentSelectedAddress
                    ? () => setCurrentSelectedAddress(addressInfo)
                    : null
            }
            className={`cursor-pointer border-red-700 ${selectedId?._id === addressInfo?._id
                ? "border-gray-300 border-[5px] bg-gray-200"
                : "border-black-400"
                }`}
        >
            <CardContent className="grid p-4 gap-4">
                <Label>Address: {addressInfo?.address}</Label>
                <Label>City: {addressInfo?.city}</Label>
                <Label>pincode: {addressInfo?.pincode}</Label>
                <Label>Phone: {addressInfo?.phone}</Label>
                <Label>Notes: {addressInfo?.notes}</Label>
            </CardContent>
            <CardFooter className="p-3 flex justify-between">
                <Button onClick={() => handleEditAddress(addressInfo)}>Edit</Button>
                <Button onClick={() => handleDeleteAddress(addressInfo)}>Delete</Button>
            </CardFooter>
        </Card>
    );
}

export default AddressCard;
