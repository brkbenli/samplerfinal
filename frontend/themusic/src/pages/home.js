import Navbar from "../components/Navbar";
import "./home.css";
import Slider from "react-slick";
import bry from "../photos/bry.jpg";
import donny from "../photos/donny.jpg";
import ye from "../photos/ye.jpg";
import trav from "../photos/trav.jpg";
import tory from "../photos/tory.jpg";
import kend from "../photos/kend.png";
// import AudioPlayer from "../components/AudioPlayer"
import SilverSoul from "../displaySongs/SilverSoul.mp3"
import elegantSoul from "../displaySongs/elegantSoul.mp3";
import moveOnUp from "../displaySongs/moveOnUp.mp3";
import AudioWave from "../components/audioplayerfile";

const images = [bry, trav, ye, donny, tory, kend];


export default function Home() {

    const settings = {
        infinite: true,
        lazyLoad: true,
        speed: 1000,
        slidesToShow: 3,
        centerMode: true,
        centerPadding: "0px",
        arrows: false,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
    }

    return (
        <>
            <Navbar />
            <div className="home">
                <div className="title">SAMPLE SEARCHER</div>
                <h1>2000+ Songs Including Samples Used By</h1>
                <Slider {...settings}>
                    {images.map((img, idx) => (
                        <div key={idx}>
                            <img src={img} alt={`slide-${idx}`} />
                        </div>
                    ))}
                </Slider>
                <div className="bottom-sections">
                <div className="left-box">
                    DISCLAMER: NONE OF THE SAMPLES ON THIS WEBSITE ARE CLEARED, THIS IS FOR PERSONAL USE ONLY AND YOU AS THE MUSICIAN ARE RESPONSIBLE FOR CLEARING ANY SAMPLES INTENDED FOR PROFIT USE
                </div>
                <div className="right-box">
                    <AudioWave audiofile={SilverSoul} boxTitle={"Includes These Songs And More!"}/>
                    <AudioWave audiofile={elegantSoul} />
                    <AudioWave audiofile={moveOnUp} />
                   
                </div>
                    </div>
                </div>
                
            
        </>
    );
};