let i; // Declare `i` globally
let c; // Declare `c` globally

// Define `b` globally so it is accessible across all functions
const b = [
    "rgb(110,64,170)", "rgb(150,61,179)", "rgb(191,60,175)",
    "rgb(228,65,157)", "rgb(254,75,131)", "rgb(255,94,99)",
    "rgb(255,120,71)", "rgb(251,150,51)", "rgb(226,183,47)",
    "rgb(198,214,60)", "rgb(175,240,91)", "rgb(127,246,88)",
    "rgb(82,246,103)", "rgb(48,239,130)", "rgb(29,223,163)",
    "rgb(26,199,194)", "rgb(35,171,216)", "rgb(54,140,225)",
    "rgb(76,110,219)", "rgb(96,84,200)"
];

function binft(r) {
    // Assign `c` globally
    c = {
        text: "",
        prefixP: -5,
        skillI: 0,
        skillP: 0,
        direction: "forward",
        delay: 2,
        step: 1,
    };

    // Assign `i` function globally
    i = function () {
        const currentSkill = o[c.skillI];
        c.step
            ? c.step--
            : (c.step = g,
              c.prefixP < l.length
                  ? (c.prefixP >= 0 && (c.text += l[c.prefixP]), c.prefixP++)
                  : c.direction === "forward"
                  ? c.skillP < currentSkill.length
                      ? (c.text += currentSkill[c.skillP], c.skillP++)
                      : c.delay
                      ? c.delay--
                      : ((c.direction = "backward"), (c.delay = a))
                  : c.skillP > 0
                  ? (c.text = c.text.slice(0, -1), c.skillP--)
                  : ((c.skillI = (c.skillI + 1) % o.length), (c.direction = "forward")));
        r.textContent = c.text;
        r.appendChild(n(c.prefixP < l.length ? Math.min(s, s + c.prefixP) : Math.min(s, currentSkill.length - c.skillP)));
        setTimeout(i, d);
    };

    var o = [
        "Never gonna give you up, but this page is gone :(",
        "Never gonna let you down, but this page let us down :(",
        "You know the rules, and so do I - this page doesn't exist :(",
        "A 404 error's what I'm thinking of :(",
        "You wouldn't get this from any other site :("
    ].map((r) => r + ""),
        a = 2,
        g = 1,
        s = 5,
        d = 75;

    const l = ""; // Dummy prefix string

    function n(r) {
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < r; i++) {
            const span = document.createElement("span");
            span.textContent = String.fromCharCode(94 * Math.random() + 33);
            span.style.color = b[Math.floor(Math.random() * b.length)];
            fragment.appendChild(span);
        }
        return fragment;
    }

    i(); // Start the animation
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        binft,
        helpers: {
            t: function () {
                return b[Math.floor(Math.random() * b.length)];
            },
            e: function () {
                return String.fromCharCode(94 * Math.random() + 33);
            },
            n: function (r) {
                const fragment = document.createDocumentFragment();
                for (let i = 0; i < r; i++) {
                    const span = document.createElement("span");
                    span.textContent = this.e();
                    span.style.color = this.t();
                    fragment.appendChild(span);
                }
                return fragment;
            },
        },
        animation: {
            get i() {
                return i; // Ensure `i` is dynamically bound
            },
            get c() {
                return c; // Ensure `c` is accessible
            },
        },
    };
}