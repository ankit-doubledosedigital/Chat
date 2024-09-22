
export default {
    setup() {
        const goToHome = () => window.location.href = '/'
        return {
            goToHome
        }
    },
    template: `
        <div class="bg-back">
            <div class="index-img"></div>
        </div>
        <div class="container-xxl h-100 d-flex position-relative z-index-1">
            <div class="d-flex justify-content-center align-items-center flex-column w-100 page-not-found-section">
                <div class="white-card-magnet text-center d-flex flex-column">
                    <h1 class="mx-auto"><img src="../../../assets/images/Access-Denied.png" width="80"></h1>
                    <h2>Access Denied !</h2>
                    <p>Sorry! you couldn't access BegenieUs.</p>
                    <!-- <button @click="goToHome()" class="btn btn-primary">Back To Home</button> -->
                </div>
            </div>
        </div>`
}