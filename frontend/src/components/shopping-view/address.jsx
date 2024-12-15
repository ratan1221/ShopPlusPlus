import { useEffect, useState } from "react"
import CommonForm from "../common/form"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { addressFormControls } from "@/config"
import { useDispatch, useSelector } from "react-redux"
import { addNewAddress, deleteAddress, editaAddress, fetchAllAddresses } from "@/store/shop/address-slice"
import AddressCard from "./address-card"
import { useToast } from "@/hooks/use-toast"


const inititalAddressFormData = {
    address: '',
    city: '',
    phone: '',
    pincode: '',
    notes: ''
}

function Address({ setCurrentSelectedAddress, selectedId }) {

    const [formData, setFormData] = useState(inititalAddressFormData);
    const [currentEditedId, setCurrentEditedId] = useState(null);
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { addressList } = useSelector(state => state.shopAddress);
    const { toast } = useToast();

    function handleManageAddress(event) {
        event.preventDefault();
        if (addressList.length >= 3 && currentEditedId === null) {
            setFormData(inititalAddressFormData)
            toast({
                title: 'You Can add Max 3 Addresses !!',
                variant: 'destructive'
            })
            return;
        }
        currentEditedId !== null ? dispatch(editaAddress({
            userId: user?.id,
            addressId: currentEditedId,
            formData
        })).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchAllAddresses(user?.id));
                setCurrentEditedId(null);
                setFormData(inititalAddressFormData)
                toast({
                    title: 'Address Updated Successfully !'
                })
            }
        }) :
            dispatch(addNewAddress({
                ...formData,
                userId: user?.id
            })).then((data) => {
                if (data?.payload?.success) {
                    dispatch(fetchAllAddresses(user?.id))
                    setFormData(inititalAddressFormData)
                    toast({
                        title: 'Address Added Successfully !'
                    })
                }
            })
    }

    function isFormValid() {
        return Object.keys(formData).map((key) => formData[key] != '')
            .every((item) => item);
    }

    function handleDeleteAddress(getCurrentAddress) {
        console.log(getCurrentAddress, "Current Address");
        dispatch(deleteAddress({
            userId: user?.id,
            addressId: getCurrentAddress._id
        })).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchAllAddresses(user?.id))
                toast({
                    title: 'Address Deleted',
                    variant: 'destructive'
                })
            }
        })

    }

    function handleEditAddress(getCurrentAddress) {
        setCurrentEditedId(getCurrentAddress?._id);
        setFormData({
            ...formData,
            address: getCurrentAddress?.address,
            city: getCurrentAddress?.city,
            phone: getCurrentAddress?.phone,
            pincode: getCurrentAddress?.pincode,
            notes: getCurrentAddress?.notes
        })
    }

    useEffect(() => {
        dispatch(fetchAllAddresses(user?.id))
    }, [dispatch])

    console.log(addressList, "Address list:-");

    return (
        <Card>
            <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 ">
                {
                    addressList && addressList.length > 0 ?
                        addressList.map((addressItem) => <AddressCard selectedId={selectedId}
                            key={addressItem._id}
                            handleDeleteAddress={handleDeleteAddress}
                            addressInfo={addressItem}
                            handleEditAddress={handleEditAddress}
                            setCurrentSelectedAddress={setCurrentSelectedAddress} />) : null
                }
            </div>
            <CardHeader>
                <CardTitle>{
                    currentEditedId !== null ? "Edit Address" : "Add new Address"
                }</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
                <CommonForm
                    formControls={addressFormControls}
                    formData={formData}
                    setFormData={setFormData}
                    buttonText={currentEditedId !== null ? "Edit " : "Add Address"
                    }
                    onSubmit={handleManageAddress}
                    isBtnDisabled={!isFormValid()}
                />
            </CardContent>
        </Card>
    )
}

export default Address