import paypal from 'paypal-rest-sdk';

// paypal.configure({
//     mode: "sandbox",
//     client_id: process.env.PAYPAL_CLIENT_ID,
//     client_secret: process.env.PAYPAL_CLIENT_SECRET,
// });
paypal.configure({
    mode: "sandbox",
    client_id: 'AeBVoPC9AMjrcO0FYneNcdsWFiDPh4gRasrbnpC3EqGXATjzRbMIHxeK6ZMmVm4U8LQt65sBoO4VpNrt',
    client_secret: 'EOB26uJC9uqPrQ3kqyryUQEQlc6UTyhCWNHQsEz1WhdfnMt1pVigCk0u8jZwvuktfDNdOBujnMECA6vp',
});

export default paypal;