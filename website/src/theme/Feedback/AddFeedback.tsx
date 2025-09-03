import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "@firebase/firestore";
import React from "react";
import { BiHappyBeaming, BiMeh, BiSad } from "react-icons/bi";
import ReactGA from "react-ga";
import "@site/src/theme/feedback.css";

interface IProps {
  location?: string;
}
interface IState {
  visible: boolean;
  fixed: boolean;
  modal: boolean;
  content: any;
  section?: string;
  feedback?: string;
}

//------------------------------------------------------------//
//--- Change this if you want a different tracking account ---//
//------------------------------------------------------------//
const trackingId = "UA-148358030-1";
ReactGA.initialize(trackingId);
//------------------------------------------------------------//
//------------------------------------------------------------//

class AddFeedback extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      visible: true,
      fixed: false,
      modal: false,
      content: props,
    };
  }

  async postToSlack(rating?: number) {
    const url = process.env.SLACK_WEBHOOK_URL;

    if (!url) {
      return;
    }

    const title = document.title.replace(/\s*\|\s*Taquito\s*$/, "");
    let text: string | undefined;
    if (rating !== undefined) {
      let ratingLabel: string | undefined;
      switch (rating) {
        case 0:
          ratingLabel = "bad";
          break;
        case 1:
          ratingLabel = "neutral";
          break;
        case 2:
          ratingLabel = "good";
          break;
        default:
          ratingLabel = undefined;
      }

      text = `New Taquito documentation rating for ${title} page. Rating: ${ratingLabel}`;
    } else {
      text = `New Taquito documentation feedback for ${title} page. Category: ${this.state.section}. Feedback: ${this.state.feedback}`;
    }

    const response = await fetch(`${url}`, {
      method: "POST",
      body: JSON.stringify({ text }),
    });
    return response;
  }

  async handleSubmit(rating) {
    try {
      this.setState({ visible: false });
      await this.postToSlack(rating);

      // Without this timeout, the Firebase operation will hang indefinitely if it fails
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Firebase operation timed out")), 5000)
      );

      const firestorePromise = addDoc(collection(db, "ratings"), {
        rating: rating,
        request: window.location.href,
        timestamp: Timestamp.now(),
      });

      await Promise.race([firestorePromise, timeoutPromise]);

      ReactGA.event({
        category: "RATINGS",
        action: rating,
        label: rating,
      });
    } catch (err) {
      console.error("Error submitting rating:", err);
      alert("Failed to submit rating: " + (err.message || err));
    }
  }

  async handleDetailedSubmit() {
    try {
      this.setState({ visible: false });
      await this.postToSlack();

      // Without this timeout, the Firebase operation will hang indefinitely if it fails
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Firebase operation timed out")), 5000)
      );

      const firestorePromise = addDoc(collection(db, "feedback"), {
        section: this.state.section,
        feedback: this.state.feedback,
        request: window.location.href,
        timestamp: Timestamp.now(),
      });

      await Promise.race([firestorePromise, timeoutPromise]);

      ReactGA.event({
        category: "FEEDBACK",
        action: this.state.section + ":" + this.state.feedback,
        label: this.state.feedback,
      });

      window.scrollTo(0, document.body.scrollHeight);
    } catch (err) {
      console.error("Error submitting detailed feedback:", err);
      alert("Failed to submit feedback: " + (err.message || err));
    }
  }

  componentDidUpdate() {}
  componentDidMount() {}

  render() {
    if (this.state.visible === true) {
      return (
        <>
          <div className="container margin-top--lg padding--none">
            <div className="alert alert--primary" role="alert">
              <div className="row">
                <div className="col text--center">
                  Please provide feedback on this article:
                  <button
                    className="button  margin--sm good"
                    onClick={() => this.handleSubmit(2)}
                  >
                    <BiHappyBeaming size={40} />
                  </button>
                  <button
                    className="button margin--sm average"
                    onClick={() => this.handleSubmit(1)}
                  >
                    <BiMeh size={40} />
                  </button>
                  <button
                    className="button  margin--sm bad"
                    onClick={() => this.handleSubmit(0)}
                  >
                    <BiSad size={40} />
                  </button>
                  <button
                    className="btn button--outline button--primary margin--sm"
                    onClick={() => this.setState({ modal: true })}
                  >
                    Leave detailed feedback
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className={`fullscreen ${this.state.modal ? "show" : "hide"}`}>
            <div className="card-demo">
              <div className="card">
                <div className="card__header">
                  <h3>Provide detailed feedback</h3>
                </div>
                <div className="card__body">
                  <div className="radio">
                    <label>
                      <input
                        type="radio"
                        id="productfeedback"
                        name="type"
                        value="TaquitoProductFeedback "
                        onClick={() =>
                          this.setState({
                            section: "Taquito Product Feedback",
                          })
                        }
                      />
                      Taquito Product Feedback
                    </label>
                  </div>
                  <div className="radio">
                    <label>
                      <input
                        type="radio"
                        id="docs"
                        name="type"
                        value="DocumentationFeedback"
                        onClick={() =>
                          this.setState({ section: "Documentation Feedback" })
                        }
                      />
                      Documentation Feedback
                    </label>
                  </div>
                  <div className="radio">
                    <label>
                      <input
                        type="radio"
                        id="bug"
                        name="type"
                        value="ReportaProductBug"
                        onClick={() =>
                          this.setState({ section: "Report a Product Bug" })
                        }
                      />
                      Report a Product Bug
                    </label>
                  </div>
                  <div className="radio">
                    <label>
                      <input
                        type="radio"
                        id="docbug"
                        name="type"
                        value="ReportaDocumentationBug"
                        onClick={() =>
                          this.setState({
                            section: "Report a Documentation Bug",
                          })
                        }
                      />
                      Report a Documentation Bug
                    </label>
                  </div>
                  <br />

                  <input
                    className="section-input"
                    disabled
                    value={this.state.section ? this.state.section : ""}
                    placeholder="Please choose a section above"
                  />
                  <textarea
                    rows={10}
                    placeholder="Please enter your feedback for this section"
                    onChange={(e) =>
                      this.setState({ feedback: e.target.value })
                    }
                  ></textarea>
                </div>
                <div className="card__footer">
                  <button
                    className="btn button--primary button--block"
                    onClick={() => this.handleDetailedSubmit()}
                  >
                    Submit feedback
                  </button>
                  <button
                    className="btn button--secondary button--block margin-top--sm"
                    onClick={() => this.setState({ modal: false })}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="container margin-top--lg padding--none text--center">
            <div className="alert alert--primary" role="alert">
              Thank you for the feedback!
            </div>
          </div>
        </>
      );
    }
  }
}
export default AddFeedback;
