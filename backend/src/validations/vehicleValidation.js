const validateVehicle = (vehicle) => {

if(!vehicle.registration_number)
return "Registration Number is required";

if(!vehicle.vehicle_name)
return "Vehicle Name is required";

if(!vehicle.type)
return "Vehicle Type is required";

if(vehicle.max_load_capacity===undefined)
return "Maximum Load Capacity is required";

if(vehicle.acquisition_cost===undefined)
return "Acquisition Cost is required";

return null;

};

module.exports={
validateVehicle
};