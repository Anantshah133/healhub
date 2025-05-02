import DocBanner from "../components/DocBanner";
import MainBanner from "../components/MainBanner";
import SpecialityMenu from "../components/SpecialityMenu";
import TopDoctors from "../components/TopDoctors";

const Home = () => {
    return (
        <main>
            <MainBanner />
            <SpecialityMenu />
            <TopDoctors />
            <DocBanner />
        </main>
    )
}

export default Home;