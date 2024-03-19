
// booking date
let boookingDate = document.getElementById('bookingDate');
if (boookingDate) boookingDate.min = new Date().toISOString().split('T')[0];
const passType = document.getElementById("passType");
const password = document.getElementById("password");
if (passType)
    passType.addEventListener("click", (e) => {
        e.preventDefault();
        if (password.type === "password") {
            password.type = "text";
        } else {
            password.type = "password";
        }
    });


// let book = document.querySelector("button");
// book.addEventListener("click", () => {




// })

// doctor name
// const doctorName = document.getElementById("doctorName");
// const isChangeDoctor = (e) => {
//     if (e) {
//         let dctrId = e.target.value;
//         fetch(`/${dctrId}`, {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//         })
//             .then(response => response.json())
//             .then(data => {
//                 data.forEach(element => {
//                     let time = element.booking_time;
//                     let date = element.booking_date;
//                     console.log(date,time);
//                 });
//             })
//             .catch(error => console.error('Error:', error));
//     }
// }


// if (doctorName) {
//     isChangeDoctor();
// }

// doctorName.addEventListener("change", isChangeDoctor);





//  CHART JS
// const ctx = document.getElementById('myChart');
// const data = [];
// const data2 = [];
// let prev = 100;
// let prev2 = 80;
// for (let i = 0; i < 400; i++) {
//     prev += 5 - Math.random() * 10;
//     data.push({ x: i, y: prev });
//     prev2 += 5 - Math.random() * 10;
//     data2.push({ x: i, y: prev2 });
// }

// const config = {
//     type: 'line',
//     data: {
//         datasets: [{
//             label: 'Patients',
//             borderColor: 'red',
//             borderWidth: 1,
//             radius: 0,
//             data: data,
//         },
//         {
//             label: 'Dataset 2',
//             borderColor: 'blue',
//             borderWidth: 1,
//             radius: 0,
//             data: data2,
//         }]
//     },
//     options: {
//         animation: {
//             x: {
//                 type: 'number',
//                 easing: 'linear',
//                 duration: 10,
//                 from: NaN,
//                 delay(ctx) {
//                     if (ctx.type !== 'data' || ctx.xStarted) {
//                         return 0;
//                     }
//                     ctx.xStarted = true;
//                     return ctx.index * 10;
//                 }
//             },
//             y: {
//                 type: 'number',
//                 easing: 'linear',
//                 duration: 10,
//                 from: 0,
//                 delay(ctx) {
//                     if (ctx.type !== 'data' || ctx.yStarted) {
//                         return 0;
//                     }
//                     ctx.yStarted = true;
//                     return ctx.index * 10;
//                 }
//             }
//         },
//         interaction: {
//             intersect: false
//         },
//         plugins: {
//             legend: false
//         },
//         scales: {
//             x: {
//                 type: 'linear'
//             }
//         }
//     }
// };

// const chart = new Chart(ctx, config);


const name = document.getElementById('name');
const username = document.getElementById('username');
const inputCity = document.getElementById('inputCity');
const inputState = document.getElementById('inputState');
const inputPincode = document.getElementById('inputPincode');
const gridCheck = document.getElementById('gridCheck');

if (inputPincode)
    function validateForm(e) {
        let value = e.target.value.trim();
        if (value.length !== 6 || !/^\d+$/.test(value)) {
            console.log('Invalid pincode format');
            return;
        }

        let api = `https://api.postalpincode.in/pincode/${value}`;

        fetch(api)
            .then((res) => res.json())
            .then((data) => {
                if (data && data.length > 0 && data[0].PostOffice) {
                    inputState.value = data[0].PostOffice[0].State
                    inputCity.value = data[0].PostOffice[0].Block
                    console.log( data[0].PostOffice[0].Block);
                } else {
                    console.log('Invalid pincode');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

inputPincode.addEventListener("input", validateForm)