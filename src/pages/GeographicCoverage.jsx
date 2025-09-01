import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { saveGeographicCoverage, saveIndustryCategory } from "../redux/reducer/onboardingSlice";
import FormHeader from "../components/FormHeader";
import HeroHeading from "../components/HeroHeading";
import FormFooter from "../components/FormFooter";
import FormRadio from "../components/FormRadio";
import FormImg from "../components/FormImg";
import FormMultiSelect from "../components/FormMultiSelect";
import ProcessWrapper from "../components/ProcessWrapper";
import { useNavigate } from "react-router-dom";
import { checkTTLAndClear } from "../utils/ttlCheck";
import { getAllStates } from "../services/user.service";

function GeographicCoverage() {
  const data = {
    title: "Where Should We Look?",
    para: "Select states, regions or industries so we only surface relevant bids.",
    btnText: false,
    btnLink: false,
    container: "max-w-4xl mx-auto text-left",
    headingSize: "h3",
    pSize: "text-xl",
  };

  const formHeader = {
    title: "Log In",
    link: "/login",
    steps: 6,
    activeStep: 2,
  };

  const regions = [
    "Northeast",
    "Northwest",
    "South",
    "Southeast",
    "Midwest",
    "West",
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedRegions, setSelectedRegions] = useState([]);
  const [nationwideSelected, setNationwideSelected] = useState(false);
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [selectionError, setSelectionError] = useState("");
  const [selectionSuccess, setSelectionSuccess] = useState("");
  const [touched, setTouched] = useState(false);
  const [stateOptions, setStateOptions] = useState([]);

  const [skipClicked, setSkipClicked] = useState(false); // 🆕 Skip flag

  useEffect(() => {
    checkTTLAndClear(navigate);
  }, []);

  useEffect(() => {
    // current entry lock kar do
    window.history.pushState(null, "", window.location.href);

    const handleBack = () => {
      window.history.go(1); // back dabane par same page par rakho
    };

    window.addEventListener("popstate", handleBack);
    return () => window.removeEventListener("popstate", handleBack);
  }, []);


  // 🔁 Load sessionStorage on first mount
  useEffect(() => {
    const saved = sessionStorage.getItem("onboardingForm");
    if (saved) {
      const parsed = JSON.parse(saved);
      const geo = parsed.geographic || {};
      setSelectedRegions(geo.selectedRegions || []);
      setNationwideSelected(geo.nationwideSelected || false);
      setSelectedIndustries(geo.selectedIndustries || []);
    }
  }, []);

  // 💾 Save to sessionStorage (only if not skipped)
  useEffect(() => {
    if (skipClicked) return;

    const prev = JSON.parse(sessionStorage.getItem("onboardingForm")) || {};
    const updated = {
      ...prev,
      geographic: {
        selectedRegions,
        nationwideSelected,
        selectedIndustries,
      },
    };
    sessionStorage.setItem("onboardingForm", JSON.stringify(updated));
  }, [selectedRegions, nationwideSelected, selectedIndustries, skipClicked]);

  // 🌐 Fetch states
  useEffect(() => {
    async function fetchStates() {
      try {
        const data = await getAllStates(); // ✅ use the service function
        if (Array.isArray(data)) {
          setStateOptions(
            data.map((item) => ({
              value: item.id,
              label: item.name,
            }))
          );
        }
      } catch (err) {
        setStateOptions([{ value: "", label: "Error loading states" }]);
      }
    }

    fetchStates();
  }, []);

  const handleNationwide = () => {
    setNationwideSelected(true);
    setSelectedRegions([]);
    setSelectedIndustries([]);
  };

  const handleRegionChange = (value) => {
    if (selectedRegions.includes(value)) {
      setSelectedRegions((prev) => prev.filter((v) => v !== value));
    } else if (selectedRegions.length < 3) {
      setSelectedRegions((prev) => [...prev, value]);
    }
    setNationwideSelected(false);
    setSelectedIndustries([]);
  };

  const handleIndustryChange = (selected) => {
    setSelectedIndustries(selected);
    setNationwideSelected(false);
    setSelectedRegions([]);
  };

  useEffect(() => {
    if (!touched) return;
    if (
      !nationwideSelected &&
      selectedRegions.length === 0 &&
      selectedIndustries.length === 0
    ) {
      setSelectionError("Please select any of the three");
      setSelectionSuccess("");
    } else {
      setSelectionError("");
      setSelectionSuccess("The field is selected");
    }
  }, [nationwideSelected, selectedRegions, selectedIndustries, touched]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);

    if (
      !nationwideSelected &&
      selectedRegions.length === 0 &&
      selectedIndustries.length === 0
    ) {
      setSelectionError("Please select any of the three");
      setSelectionSuccess("");
      return;
    }

    const geoData = nationwideSelected
      ? { region: "Nationwide", states: [] }
      : selectedRegions.length > 0
        ? { region: "Region", states: selectedRegions }
        : { region: "", states: [] };

    const industryData = selectedIndustries;

    dispatch(saveGeographicCoverage(geoData));
    dispatch(saveIndustryCategory(industryData));

    navigate("/industry-categories");
  };

  // 🆕 Handle Skip
  const handleSkip = () => {
    setSkipClicked(true);

    // Remove geographic from sessionStorage
    const prev = JSON.parse(sessionStorage.getItem("onboardingForm")) || {};
    delete prev.geographic;
    sessionStorage.setItem("onboardingForm", JSON.stringify(prev));

    navigate("/industry-categories");
  };


  const formFooter = {
    // back: {
    //   text: "Back",
    //   link: "/plan",
    // },
    next: {
      text: "Next",
    },
    skip: {
      text: "Skip",
      link: "/industry-categories"
    },
  };

  return (
    <ProcessWrapper>
      <div className="form-left">
        <div className="flex flex-col justify-between h-full">
          <div>
            <FormHeader {...formHeader} />
            <HeroHeading data={data} />
          </div>

          <form
            className="forn-container flex flex-col h-full justify-between"
            onSubmit={handleSubmit}
          >
            <div className="w-[100%] md:w-[90%]">
              <FormRadio
                label="Nationwide"
                type="radio"
                name="region"
                value="Nationwide"
                delay={100}
                selectedValue={nationwideSelected ? "Nationwide" : ""}
                onChange={handleNationwide}
              />

              <div className="form-label font-t my-5">Select region</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                {regions.map((reg, i) => (
                  <FormRadio
                    key={i}
                    type="checkbox"
                    label={reg}
                    name="region-multi"
                    value={reg}
                    selectedValues={selectedRegions}
                    onChange={() => handleRegionChange(reg)}
                    maxSelected={3}
                    delay={i * 100}
                  />
                ))}
              </div>

              <FormMultiSelect
                label="Select State"
                name="industries"
                placeholder="Choose State (Max 10)"
                options={stateOptions}
                value={selectedIndustries}
                onChange={handleIndustryChange}
                menuPlacement="auto"
              />

              <div style={{ marginTop: 14 }}>
                {selectionError && touched && (
                  <span className="flex items-center gap-1 text-red-400 text-sm">
                    <i className="far fa-times text-red-400"></i>
                    {selectionError}
                  </span>
                )}
                {selectionSuccess && !selectionError && touched && (
                  <span className="flex items-center gap-1 text-green-400 text-sm">
                    <i className="far fa-check text-green-400"></i>
                    {selectionSuccess}
                  </span>
                )}
              </div>
            </div>

            <FormFooter
              data={formFooter}
              onSkipClick={handleSkip} // 🆕 passed skip handler
            />
          </form>
        </div>
      </div>

      <div className="sticky top-0">
        <FormImg src={"geographic-coverage.png"} />
      </div>
    </ProcessWrapper>
  );
}

export default GeographicCoverage;
