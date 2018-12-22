const YEAR2019 = new Date(2019, 0, 0, 0, 0, 0, 0)
const RESTSEC = Math.max(2, (YEAR2019 - new Date()) / 1000)
window.onload = () => {
    let bg = document.getElementById("bg")
    let wrapper = document.getElementById("wrapper")
    let h100 = document.getElementById("h100")
    let h10 = document.getElementById("h10")
    let h1 = document.getElementById("h1")
    let m10 = document.getElementById("m10")
    let m1 = document.getElementById("m1")
    let s10 = document.getElementById("s10")
    let s1 = document.getElementById("s1")
    let newYear = false

    wrapper.style.backgroundColor = `rgba(50, 50, 100, ${Math.floor(RESTSEC/10800)/100})`
    wrapper.style.transition = `background-color ${RESTSEC}s`
    wrapper.style.backgroundColor = `rgba(50, 50, 100, 1)`;

    function genNewYear() {
        let elem = document.createElement("div")
        elem.id = "happynewyear"
        elem.innerText = "Happy New Year!!"
        wrapper.appendChild(elem)
        console.log("Happy New Year!!")
    }

    function update() {
        const now = new Date()
        let diff = (YEAR2019 - now) / 1000
        if (!newYear && diff <= 0) {
            newYear = true
            genNewYear();
            const spans = document.getElementsByTagName("span")
            for (let i = 0; i < spans.length; ++i) {
                spans[i].classList.add("remove")
            }
        }
        const seconds = diff % 60;
        diff = (diff - seconds) / 60
        const minutes = diff % 60;
        diff = (diff - minutes) / 60
        const hours = diff

        const s_sec = ("00" + Math.floor(seconds)).slice(-2)
        const s_min = ("00" + Math.floor(minutes)).slice(-2)
        const s_hour = ("000" + Math.floor(hours)).slice(-3)

        h100.innerText = s_hour[0]
        h10.innerText = s_hour[1]
        h1.innerText = s_hour[2]
        m10.innerText = s_min[0]
        m1.innerText = s_min[1]
        s10.innerText = s_sec[0]
        s1.innerText = s_sec[1]

        requestAnimationFrame(update)
    }

    requestAnimationFrame(update)
}