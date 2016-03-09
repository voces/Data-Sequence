
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

    function goBack() {

        if (position === 0) {

            console.error("Cannot go back, on first section");
            return;

        }

        sections[position].container.style.display = "none";

        if (sections[position].blur) sections[position].blur();

        position--;

        sections[position].container.style.display = "block";

        if (sections[position].hideControls) controls.style.display = "none";
        else controls.style.display = "block";

        if (sections[position].focus) sections[position].focus();

    }

    function goNext() {

        if (position === sections.length - 1) {

            console.error("Cannot go forward, on last section");
            return;

        }

        sections[position].container.style.display = "none";

        if (sections[position].blur) sections[position].blur();

        position++;

        sections[position].container.style.display = "block";

        if (sections[position].hideControls) controls.style.display = "none";
        else controls.style.display = "block";

        if (sections[position].focus) sections[position].focus();

    }

    window.control = {
        goNext: goNext,
        goBack: goBack
    };

}(window));
