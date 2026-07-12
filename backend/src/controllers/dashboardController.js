const {

getDashboardCounts,

getFleetUtilization,

getRecentTrips,

getVehicleStatusSummary,

getFuelEfficiency,

getOperationalCost,

getVehicleROI,

getMonthlyRevenue,

getCostliestVehicles,

} = require("../models/dashboardModel");


const getDashboard = async (req,res)=>{

try{

const counts =
await getDashboardCounts();

const fleet =
await getFleetUtilization();

const trips =
await getRecentTrips();

const status =
await getVehicleStatusSummary();

const fuel =
await getFuelEfficiency();

const cost =
await getOperationalCost();

const roi =
await getVehicleROI();

const revenue =
await getMonthlyRevenue();

const costliest =
await getCostliestVehicles();

return res.status(200).json({

success:true,

dashboard:{

counts,

fleet,

recentTrips:trips,

vehicleStatus:status,

analytics:{

fuelEfficiency:fuel,

operationalCost:cost,

vehicleROI:roi,

monthlyRevenue:revenue,

costliestVehicles:costliest,

},

},

});

}catch(error){

console.error(error);

return res.status(500).json({

success:false,
message:"Internal Server Error",

});

}

};


module.exports={
getDashboard,
};