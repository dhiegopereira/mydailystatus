//alert(calcCrow(59.3293371,13.4877472,59.3225525,13.4619422).toFixed(1));

const toRad = (Value) => {
    return Value * Math.PI / 180;
}

const distance = (lat1, lon1, lat2, lon2) => {    
    const R = 6371; // km
    const dLat = toRad(lat2-lat1)
    const dLon = toRad(lon2-lon1)
    lat1 = toRad(lat1)
    lat2 = toRad(lat2)

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c;
    return d;
}

module.exports = { distance }



   