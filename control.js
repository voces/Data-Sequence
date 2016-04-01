
(function(window) {

    "use strict";

    let sections = window.sections || (window.sections = []),

        position,

        controls, back, next;

    document.addEventListener("DOMContentLoaded", function(e) {

        position = 0;

        controls = document.getElementById("controls");
        back = document.getElementById("controls-back");
        next = document.getElementById("controls-next");

        back.addEventListener("click", goBack);
        next.addEventListener("click", goNext);

    });

    function blur() {

        sections[position].container.style.display = "none";

        if (sections[position].blur) sections[position].blur();

    }

    function focus() {

        sections[position].container.style.display = "block";

        if (sections[position].hideControls) controls.style.display = "none";
        else controls.style.display = "block";

        console.log(sections[position].disableNext);
        if (sections[position].disableNext) {
            next.disabled = true;
            console.log("true");
        } else {
            next.disabled = false;
            console.log("false");
        }

        if (sections[position].focus) sections[position].focus();

    }

    function goBack() {

        if (position === 0) {

            console.error("Cannot go back, on first section");
            return;

        }

        blur();

        position--;

        focus();

    }

    function goNext() {

        if (position === sections.length - 1) {

            console.error("Cannot go forward, on last section");
            return;

        }

        blur();

        position++;

        focus();

    }

    window.control = {
        goNext: goNext,
        goBack: goBack
    };

    Object.defineProperty(window.control, "section", {
        get: () => sections[position]
    })

}(window));
