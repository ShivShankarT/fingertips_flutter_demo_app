const QUE_VIEW_MODE = 1;
const QUE_SINGLE_SELECT_MODE = 2;
const QUE_SINGLE_SELECT__SHOW_ANS_MODE = 3;
const QUE_MULTI_SELECT_TILL_COR_MODE = 4;


function ready(fn) {
    var d = document;
    (d.readyState === 'loading') ? d.addEventListener('DOMContentLoaded', fn) : fn();
}

function removeClass(el, className) {
    if (el.classList)
        el.classList.remove(className);
    else if (hasClass(el, className)) {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
        el.className = el.className.replace(reg, ' ');
    }
}

ready(function () {
    configureMathjax();
    //if (!('jsObject' in window))
        displayMockQuestions();
    console.log(":done")
});


function getOptionContainerId(option) {
    var optionContId = null;
    switch (option) {
        case 'A':
            optionContId = "container_option_a";
            break;
        case 'B':
            optionContId = "container_option_b";
            break;
        case 'C':
            optionContId = "container_option_c";
            break;
        case 'D':
            optionContId = "container_option_d";
            break;

    }
    return optionContId;
}

var selectedOption = null;
var quizMode = QUE_VIEW_MODE;
var disableOptionClick = false;
var answer;

function optionClicked(option) {

    if (disableOptionClick) {
        return;
    }

    var prevSelectedOption = selectedOption;

    console.log(":done" + option + " " + prevSelectedOption);

    var selectedCss = "selected";
    if (quizMode === QUE_SINGLE_SELECT__SHOW_ANS_MODE){
        selectedCss="wrong";
    }

    if (prevSelectedOption !== null && prevSelectedOption !== undefined) {
        var optionContId = getOptionContainerId(prevSelectedOption);
        var optionElement = document.getElementById(optionContId);
        if (optionElement != null && quizMode === QUE_SINGLE_SELECT_MODE && optionElement.classList.contains(selectedCss))
            optionElement.classList.remove(selectedCss);

    }

    selectedOption = option;

    if ((quizMode === QUE_SINGLE_SELECT__SHOW_ANS_MODE || quizMode === QUE_MULTI_SELECT_TILL_COR_MODE) && selectedOption === answer) {

    } else {
        var optionContId = getOptionContainerId(option);
        var optionElement = document.getElementById(optionContId);
        if (!optionElement.classList.contains(selectedCss))
            optionElement.classList.add(selectedCss);
    }

    if ('jsObject' in window)
        jsObject.onOptionClicked(selectedOption);
    if (quizMode === QUE_SINGLE_SELECT__SHOW_ANS_MODE) {
        disableOptionClick = true;
        var optionContId = getOptionContainerId(answer);
        var optionElement = document.getElementById(optionContId);
        if (!optionElement.classList.contains("correct"))
            optionElement.classList.add("correct");
    }
    if (quizMode === QUE_MULTI_SELECT_TILL_COR_MODE && selectedOption === answer) {
        disableOptionClick = true;
        var optionContId = getOptionContainerId(answer);
        var optionElement = document.getElementById(optionContId);
        if (!optionElement.classList.contains("correct"))
            optionElement.classList.add("correct");
    }

}

function configureMathjax() {
    MathJax.Hub.Config({
        showProcessingMessages: false,
        showMathMenu: false,
        messageStyle: "none",
        tex2jax: {
            inlineMath: [['$$', '$$'], ['\\(', '\\)']],
            displayMath: [['$$$', '$$$'], ['\\(', '\\)']]
        },
        styles: {
            ".MathJax_SVG svg > g, .MathJax_SVG_Display svg > g": {
                fill: "#4A4A4A",
                stroke: "#4A4A4A"
            }
        },
        SVG: {
            linebreaks: {
                automatic: true,
                width: "container"
            },
            minScaleAdjust: 50

        }
    });

    MathJax.Hub.Register.StartupHook('End', function () {

    Toaster.postMessagenn("User Agent: " + navigator.userAgent);
        if ('jsObject' in window)
            jsObject.mathjax_done("dddd");
    });
}


function displayMockQuestions() {

    var questions = {
        question: "Which of the following statements is TRUE<br>Statement I: The sum of the lengths of any two sides of a triangle is greater than the length of the third side<br>Statement 2: If $$P$$ is a point on the side $$BC$$ of $$\\triangle {ABC}$$. Then $$(AB+BC+AC)> 2AP$$",
        question_image: "https://via.placeholder.com/450",
        questionExp: "sss",
        questionExpImage: "https://via.placeholder.com/150",
        selectedOption: null,
        answer: "D",
        mode: QUE_SINGLE_SELECT__SHOW_ANS_MODE,
        options: [
            {
                option: "A thin uniform rod, pivoted at $$O$$, is rotating in the horizontal plane with constant angular speed $$\omega$$, as shown in the figure. At time $$t = 0$$, a small insect starts from $$O$$ and moves with constant speed $$v$$ with respect to the rod towards the other end.",
                optionType: "TEXT"//TEXT or IMAGE
            }
            ,
            {
                option: "https://via.placeholder.com/550x100",
                optionType: "IMAGE"//TEXT or IMAGE
            },

            {
                option: "CCCC",
                optionType: "TEXT"//TEXT or IMAGE
            },
            {
                option: "DDDD",
                optionType: "TEXT"//TEXT or IMAGE
            }

        ]

    };

    var questionsJSONEncoded = window.btoa(JSON.stringify(questions));
    displayQuestions(questionsJSONEncoded);
}


function displayQuestions(questionsJSONEncoded) {

    try {

        var question = decodedBase64ToJSONObject(questionsJSONEncoded);
        selectedOption = question.selectedOption;
        quizMode = question.mode;
        answer = question.answer;
        if (quizMode === QUE_VIEW_MODE) {
            disableOptionClick = true;
        }
        document.getElementById('question').innerHTML = question.question;
        if (question.question_image !== undefined && question.question_image !== "") {
            document.getElementById('question_image').src = question.question_image;

        } else {
            document.getElementById('question_image').remove();
        }

        for (var i = 0; i < question.options.length; i++) {
            var opt = question.options[i].option;
            var optionType = question.options[i].optionType;
            var optionElementId = '';
            var optionContId = '';
            var optionImgElementId = '';
            var optionLabel = '';

            switch (i) {
                case 0:
                    optionElementId = 'opt_a';
                    optionImgElementId = 'opt_a_image';
                    optionContId = "container_option_a";
                    optionLabel = "A";
                    break;
                case 1:
                    optionElementId = 'opt_b';
                    optionImgElementId = 'opt_b_image';
                    optionContId = "container_option_b";
                    optionLabel = "B";
                    break;
                case 2:
                    optionElementId = 'opt_c';
                    optionImgElementId = 'opt_c_image';
                    optionContId = "container_option_c";
                    optionLabel = "C";
                    break;
                case 3:
                    optionElementId = 'opt_d';
                    optionImgElementId = 'opt_d_image';
                    optionContId = "container_option_d";
                    optionLabel = "D";
                    break;

            }

            var selected = "selected";
            if (question.mode === QUE_VIEW_MODE){
                selected="wrong";
            }


            if (optionLabel === question.selectedOption&&question.selectedOption !== answer) {
                var optionElement = document.getElementById(optionContId);
                optionElement.classList.add(selected);

            }


            if (question.mode === QUE_VIEW_MODE && optionLabel === question.answer) {
                var optionElement = document.getElementById(optionContId);
                optionElement.classList.add("correct");

            }


            var optionElement = document.getElementById(optionElementId);
            var optionImgElement = document.getElementById(optionImgElementId);
            if (optionType === "TEXT") {
                optionElement.innerHTML = opt;
                optionImgElement.remove();
            } else {
                optionElement.remove();
                optionImgElement.src = opt;
            }
        }

        if (question.mode === QUE_VIEW_MODE) {//todo

            document.getElementById('explanation_question').innerHTML = question.questionExp;
            if (question.questionExpImage !== undefined && question.questionExpImage !== "") {
                document.getElementById('explanation_question_img').src = question.questionExpImage;

            } else {
                document.getElementById('explanation_question_img').remove();
            }

            if (!(question.questionExp !== undefined && question.questionExp !== "" || question.questionExpImage !== undefined && question.questionExpImage !== ""))
                document.getElementById('explanation_ly').remove();
            else
                removeClass(document.getElementById("explanation_ly"), "hidden")

        }

        setTimeout(function () {
            MathJax.Hub.Queue(
                ['Typeset', MathJax.Hub],
                function () {
                    if ('jsObject' in window) jsObject.onQuestionLoad();
                }
            );
        }, 0);

        //.removeClass("hidden");

        removeClass(document.getElementById("question_container"), "hidden")


    } catch (e) {
        console.error('Failed to parse question JSON', e);
        if ('jsObject' in window)
            jsObject.onQuestionError();
    }
}


function displayQuestionExplanation(questionsJSONEncoded) {

    try {

        var question = decodedBase64ToJSONObject(questionsJSONEncoded);


        document.getElementById('explanation_question').innerHTML = question.questionExp;
        if (question.questionExpImage !== undefined && question.questionExpImage !== "") {
            document.getElementById('explanation_question_img').src = question.questionExpImage;

        } else {
            document.getElementById('explanation_question_img').remove();
        }

        if (!(question.questionExp !== undefined && question.questionExp !== "" || question.questionExpImage !== undefined && question.questionExpImage !== ""))
            document.getElementById('explanation_ly').remove();



        setTimeout(function () {
            MathJax.Hub.Queue(
                ['Typeset', MathJax.Hub],
                function () {
                    if ('jsObject' in window) jsObject.onQuestionLoad();
                }
            );
        }, 0);

        //.removeClass("hidden");

        removeClass(document.getElementById("question_container"), "hidden")


    } catch (e) {
        console.error('Failed to parse question JSON', e);
        if ('jsObject' in window)
            jsObject.onQuestionError();
    }
}


function decodedBase64ToJSONObject(base64EncodedString) {
    try {
        var jsonString;
        if ('jsObject' in window) {
            jsonString = b64DecodeUnicode(base64EncodedString);
        } else
            jsonString = window.atob(base64EncodedString);


        console.log(jsonString);
        //return $.parseJSON(jsonString);
        //var actual = JSON.parse(atob(encoded))  var encoded = btoa(JSON.stringify(obj))
        return JSON.parse(jsonString);
    } catch (e) {
        console.error('Error while decoding to json object', e);
    }
}

function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(window.atob(str).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}
