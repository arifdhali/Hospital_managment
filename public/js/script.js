
// booking date
let boookingDate = document.getElementById('bookingDate');
if (boookingDate) boookingDate.min = new Date().toISOString().split('T')[0];


let book = document.querySelector("button");
book.addEventListener("click", () => {




})

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


const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        fetch("/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        })
            .then(response => {
                if (response.redirected) {
                    window.location.href = response.url;
                }
            })
            .catch(error => {
                console.error("Error:", error);
            });
    });
}


//  CHART JS
const ctx = document.getElementById('myChart');
const data = [];
const data2 = [];
let prev = 100;
let prev2 = 80;
for (let i = 0; i < 400; i++) {
    prev += 5 - Math.random() * 10;
    data.push({ x: i, y: prev });
    prev2 += 5 - Math.random() * 10;
    data2.push({ x: i, y: prev2 });
}

const config = {
    type: 'line',
    data: {
        datasets: [{
            label: 'Patients',
            borderColor: 'red',
            borderWidth: 1,
            radius: 0,
            data: data,
        },
        {
            label: 'Dataset 2',
            borderColor: 'blue',
            borderWidth: 1,
            radius: 0,
            data: data2,
        }]
    },
    options: {
        animation: {
            x: {
                type: 'number',
                easing: 'linear',
                duration: 10,
                from: NaN, 
                delay(ctx) {
                    if (ctx.type !== 'data' || ctx.xStarted) {
                        return 0;
                    }
                    ctx.xStarted = true;
                    return ctx.index * 10;
                }
            },
            y: {
                type: 'number',
                easing: 'linear',
                duration: 10,
                from: 0,
                delay(ctx) {
                    if (ctx.type !== 'data' || ctx.yStarted) {
                        return 0;
                    }
                    ctx.yStarted = true;
                    return ctx.index * 10;
                }
            }
        },
        interaction: {
            intersect: false
        },
        plugins: {
            legend: false
        },
        scales: {
            x: {
                type: 'linear'
            }
        }
    }
};

const chart = new Chart(ctx, config);
