
(function(window) {

    window.util = {
        getSelectOptions: (select) => {

            let arr = Array.prototype.filter.apply(
                select.options, [
                    function(o) {
                        return o.selected;
                    }
                ]
            );

            for (let i = 0; i < arr.length; i++)
                arr[i] = arr[i].textContent;

            return arr;
        }
    }

}(window));
