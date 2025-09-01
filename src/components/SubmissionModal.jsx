import React from "react";

const SubmissionModal = ({ onBack, onContinue, onClose }) => {
  return (
    <div className="fixed inset-0 p-4 bg-white bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-blue text-white rounded-2xl w-[600px] p-6 relative shadow-lg border border-white/20 backdrop-blur-md">
        {/* Close Button */}
        {/* <button
          className="absolute top-4 right-4 text-white text-2xl"
          onClick={onClose}
        >
          &times;
        </button> */}

        {/* Title */}
        <h2 className=" font-semibold text-center mb-4 text-g font-archivo text-h3">Submission</h2>

        {/* Inner Box */}
        <div className="border border-white/30 rounded-lg p-4 text-center mb-6">
          <h3 className="text-lg font-inter font-semibold mb-2">YOU ARE ABOUT TO SUBMIT YOUR RESPONSE</h3>
          <p className="text-sm font-inter text-white/90 leading-relaxed">
            If you want to fill this page, kindly fill the previous page first. These pages help our A.I. better understand your profile in order to provide <br></br> more accurate responses. <br></br><br></br>If you still wish to skip, you will be able to complete <br></br>these steps in your User Profile setings.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col-reverse md:flex-row gap-3 justify-between px-4">
          <button
            onClick={onBack}
            className="px-6 py-2 border border-white rounded-lg text-white hover:bg-white/10"
          >
            Back
          </button>
          <button
            onClick={onContinue}
            className="px-6 py-2 bg-primary rounded-lg text-white hover:bg-blue-700"
          >
            Understood, now continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionModal;
