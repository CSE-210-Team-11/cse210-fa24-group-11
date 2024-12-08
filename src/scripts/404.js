var binft = function (r) {
    function t() {
        return b[Math.floor(Math.random() * b.length)]
    }  
    
    function e() {
        return String.fromCharCode(94 * Math.random() + 33)
    }
    
    function n(r) {
        var n = document.createDocumentFragment();
        var i;
        var l;
    
        for (i = 0; r > i; i++) {
            l = document.createElement("span");
            l.textContent = e();
            n.appendChild(l);
        }
    
        return n;
    }
    
    
    function i() {
        var t = o[c.skillI];
        if (c.step) {
            c.step--;
        } else {
            c.step = g;
            if (c.prefixP < l.length) {
                if (c.prefixP >= 0) {
                    c.text += l[c.prefixP];
                }
                c.prefixP++;
            } else if (c.direction === "forward") {
                if (c.skillP < t.length) {
                    c.text += t[c.skillP];
                    c.skillP++;
                } else if (c.delay) {
                    c.delay--;
                } else {
                    c.direction = "backward";
                    c.delay = a;
                }
            } else if (c.skillP > 0) {
                c.text = c.text.slice(0, -1);
                c.skillP--;
            } else {
                c.skillI = (c.skillI + 1) % o.length;
                c.direction = "forward";
            }
        }
        r.textContent = c.text;
        r.appendChild(n(c.prefixP < l.length ? Math.min(s, s + c.prefixP) : Math.min(s, t.length - c.skillP)));
        setTimeout(i, d)
    }
    
    var l = "";
    var o = [
        "Never gonna give you up, but this page is gone :(",
        "Never gonna let you down, but this page let us down :(",
        "You know the rules, and so do I - this page doesn't exist :(",
        "A 404 error's what I'm thinking of :(",
        "You wouldn't get this from any other site :("
    ].map(function (r) {
        return r
    });
    var a = 2;
    var g = 1;
    var s = 5;
    var d = 75;
    var b = [
        "rgb(110,64,170)", "rgb(150,61,179)", "rgb(191,60,175)", 
        "rgb(228,65,157)", "rgb(254,75,131)", "rgb(255,94,99)", 
        "rgb(255,120,71)", "rgb(251,150,51)", "rgb(226,183,47)", 
        "rgb(198,214,60)", "rgb(175,240,91)", "rgb(127,246,88)", 
        "rgb(82,246,103)", "rgb(48,239,130)", "rgb(29,223,163)", 
        "rgb(26,199,194)", "rgb(35,171,216)", "rgb(54,140,225)", 
        "rgb(76,110,219)", "rgb(96,84,200)"
    ];
    var c = {
        text: "",
        prefixP: -s,
        skillI: 0,
        skillP: 0,
        direction: "forward",
        delay: a,
        step: g
    };
    
    i();
};

document.addEventListener('DOMContentLoaded', function() {
    binft(document.getElementById('binft'));
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        binft,
        helpers: {
            t: () => b[Math.floor(Math.random() * b.length)],
            e: () => String.fromCharCode(94 * Math.random() + 33),
            n: function (r) {
                const fragment = document.createDocumentFragment();
                for (let i = 0; i < r; i++) {
                    const span = document.createElement('span');
                    span.textContent = this.e();
                    span.style.color = this.t();
                    fragment.appendChild(span);
                }
                return fragment;
            },
        },
        animation: {
            i,
            c,
            l,
        },
    };
}