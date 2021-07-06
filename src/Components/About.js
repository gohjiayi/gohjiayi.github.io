import React, { Component } from "react";
import Fade from "react-reveal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

class About extends Component {
  render() {
    if (!this.props.data) return null;

    const profilepic = "images/" + this.props.data.image;
    const bio = this.props.data.bio.map(function (sentence) {
      return (
        <p>{sentence}</p>
      );
    });

    const resumeDownload = this.props.data.resumedownload;
    return (
      <section id="about">
        <Fade duration={1000}>
          <div className="row">
            <div className="three columns">
              <img
                className="profile-pic"
                src={profilepic}
                alt="Goh Jia Yi, Jesa Profile Pic"
              />
            </div>
            <div className="nine columns main-col">
              <h2>About</h2>
              <p>{bio}</p>
              <div className="row">
                <div className="columns download">
                  <p>
                    <a href={resumeDownload} className="button" target="_blank" rel="noreferrer">
                    <FontAwesomeIcon icon={faDownload} />&nbsp; Download Resume
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Fade>
      </section>
    );
  }
}

export default About;
