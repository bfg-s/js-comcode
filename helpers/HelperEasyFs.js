const path = require('path');
const fs = require('fs');

module.exports = new class {

    statistic (path) {
        return fs.statSync(path);
    }

    dirname (path) {
        return String(path).replace(/\\/g, '/')
            .replace(/\/[^/]*\/?$/, '');
    }

    read_all_dir (dir) {
        const stat = fs.statSync(dir);
        return stat.isDirectory() && ! stat.isSymbolicLink() ? (fs.readdirSync(dir).reduce((files, file) => {
            const name = path.join(dir, file);
            const stat = fs.statSync(name);
            const isDirectory = stat.isDirectory();
            if (isDirectory && ! stat.isSymbolicLink()) {
                try {
                    return [...files, ...this.read_all_dir(name)];
                } catch (e) {
                    return  [...files, name];
                }
            }
            return  [...files, name];
        }, [])) : []
    }

    read_dir (path) {
        if (Array.isArray(path)) path = path(...path);
        return fs.readdirSync(path);
    }

    stat (path) {
        if (Array.isArray(path)) path = path(...path);
        return fs.lstatSync(path);
    }

    exists (path) {
        if (Array.isArray(path)) path = path(...path);
        return fs.existsSync(path);
    }

    unlink (path) {
        if (Array.isArray(path)) path = path(...path);
        return fs.unlinkSync(path);
    }

    is_file (file) {
        if (Array.isArray(file)) file = path(...file);
        return this.exists(file) ? this.stat(file).isFile() : false;
    }

    is_link (path) {
        if (Array.isArray(path)) path = path(...path);
        return this.exists(path) ? this.stat(path).isSymbolicLink() : false;
    }

    is_dir (dir) {
        if (Array.isArray(dir)) dir = path(...dir);
        return this.exists(dir) ? this.stat(dir).isDirectory() : false;
    }

    mkdir (path) {
        if (Array.isArray(path)) path = path(...path);
        return fs.mkdirSync(path, { recursive: true });
    }

    put_contents (file, content) {
        if (Array.isArray(file)) file = path(...file);
        let dir = this.dirname(file);
        if (!this.is_dir(dir)) this.mkdir(dir);
        return fs.writeFileSync(file, content);
    }

    append_contents (path, data, options = {}) {
        if (Array.isArray(path)) path = path(...path);
        return fs.appendFileSync(path, data, options);
    }

    get_contents (file) {
        if (Array.isArray(file)) file = path(...file);
        if (this.is_file(file)) {
            return fs.readFileSync(file).toString();
        }
        return '';
    }

    get_json_contents (file) {
        if (Array.isArray(file)) file = path(...file);
        let json = [];
        if (this.is_file(file)) {
            try {json = JSON.parse(this.get_contents(file));} catch (e) {
                json = []
            }
        }
        return json;
    }

    pathinfo(path, options) {
        //  discuss at: http://phpjs.org/functions/pathinfo/
        // original by: Nate
        //  revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // improved by: Brett Zamir (http://brett-zamir.me)
        // improved by: Dmitry Gorelenkov
        //    input by: Timo
        //        note: Inspired by actual PHP source: php5-5.2.6/ext/standard/string.c line #1559
        //        note: The way the bitwise arguments are handled allows for greater flexibility
        //        note: & compatability. We might even standardize this code and use a similar approach for
        //        note: other bitwise PHP functions
        //        note: php.js tries very hard to stay away from a core.js file with global dependencies, because we like
        //        note: that you can just take a couple of functions and be on your way.
        //        note: But by way we implemented this function, if you want you can still declare the PATHINFO_*
        //        note: yourself, and then you can use: pathinfo('/www/index.html', PATHINFO_BASENAME | PATHINFO_EXTENSION);
        //        note: which makes it fully compliant with PHP syntax.
        //  depends on: basename
        //   example 1: pathinfo('/www/htdocs/index.html', 1);
        //   returns 1: '/www/htdocs'
        //   example 2: pathinfo('/www/htdocs/index.html', 'PATHINFO_BASENAME');
        //   returns 2: 'index.html'
        //   example 3: pathinfo('/www/htdocs/index.html', 'PATHINFO_EXTENSION');
        //   returns 3: 'html'
        //   example 4: pathinfo('/www/htdocs/index.html', 'PATHINFO_FILENAME');
        //   returns 4: 'index'
        //   example 5: pathinfo('/www/htdocs/index.html', 2 | 4);
        //   returns 5: {basename: 'index.html', extension: 'html'}
        //   example 6: pathinfo('/www/htdocs/index.html', 'PATHINFO_ALL');
        //   returns 6: {dirname: '/www/htdocs', basename: 'index.html', extension: 'html', filename: 'index'}
        //   example 7: pathinfo('/www/htdocs/index.html');
        //   returns 7: {dirname: '/www/htdocs', basename: 'index.html', extension: 'html', filename: 'index'}

        let opt = '',
            real_opt = '',
            optName = '',
            optTemp = 0,
            tmp_arr = {},
            cnt = 0,
            i = 0;
        let have_basename = false,
            have_extension = false,
            have_filename = false;

        // Input defaulting & sanitation
        if (!path) {
            return false;
        }
        if (!options) {
            options = 'PATHINFO_ALL';
        }

        // Initialize binary arguments. Both the string & integer (constant) input is
        // allowed
        let OPTS = {
            'PATHINFO_DIRNAME': 1,
            'PATHINFO_BASENAME': 2,
            'PATHINFO_EXTENSION': 4,
            'PATHINFO_FILENAME': 8,
            'PATHINFO_ALL': 0
        };
        // PATHINFO_ALL sums up all previously defined PATHINFOs (could just pre-calculate)
        for (optName in OPTS) {
            // eslint-disable-next-line no-prototype-builtins
            if(OPTS.hasOwnProperty(optName)){
                OPTS.PATHINFO_ALL = OPTS.PATHINFO_ALL | OPTS[optName];
            }
        }
        if (typeof options !== 'number') {
            // Allow for a single string or an array of string flags
            options = [].concat(options);
            for (i = 0; i < options.length; i++) {
                // Resolve string input to bitwise e.g. 'PATHINFO_EXTENSION' becomes 4
                if (OPTS[options[i]]) {
                    optTemp = optTemp | OPTS[options[i]];
                }
            }
            options = optTemp;
        }

        // Internal Functions
        let __getExt = function (path) {
            let str = path + '';
            let dotP = str.lastIndexOf('.') + 1;
            return !dotP ? false : dotP !== str.length ? str.substr(dotP) : '';
        };

        // Gather path infos
        if (options & OPTS.PATHINFO_DIRNAME) {
            let dirName = path.replace(/\\/g, '/')
                .replace(/\/[^/]*\/?$/, ''); // dirname
            tmp_arr.dirname = dirName === path ? '.' : dirName;
        }

        if (options & OPTS.PATHINFO_BASENAME) {
            if (false === have_basename) {
                have_basename = this.basename(path);
            }
            tmp_arr.basename = have_basename;
        }

        if (options & OPTS.PATHINFO_EXTENSION) {
            if (false === have_basename) {
                have_basename = this.basename(path);
            }
            if (false === have_extension) {
                have_extension = __getExt(have_basename);
            }
            if (false !== have_extension) {
                tmp_arr.extension = have_extension;
            }
        }

        if (options & OPTS.PATHINFO_FILENAME) {
            if (false === have_basename) {
                have_basename = this.basename(path);
            }
            if (false === have_extension) {
                have_extension = __getExt(have_basename);
            }
            if (false === have_filename) {
                have_filename = have_basename.slice(0, have_basename.length - (have_extension ? have_extension.length + 1 :
                    have_extension === false ? 0 : 1));
            }

            tmp_arr.filename = have_filename;
        }

        // If array contains only 1 element: return string
        cnt = 0;
        for (opt in tmp_arr) {
            // eslint-disable-next-line no-prototype-builtins
            if(tmp_arr.hasOwnProperty(opt)){
                cnt++;
                real_opt = opt;
            }
        }
        if (cnt === 1) {
            return tmp_arr[real_opt];
        }

        // Return full-blown array
        return tmp_arr;
    }

    basename(path, suffix) {
        //  discuss at: http://phpjs.org/functions/basename/
        // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // improved by: Ash Searle (http://hexmen.com/blog/)
        // improved by: Lincoln Ramsay
        // improved by: djmix
        // improved by: Dmitry Gorelenkov
        //   example 1: basename('/www/site/home.htm', '.htm');
        //   returns 1: 'home'
        //   example 2: basename('ecra.php?p=1');
        //   returns 2: 'ecra.php?p=1'
        //   example 3: basename('/some/path/');
        //   returns 3: 'path'
        //   example 4: basename('/some/path_ext.ext/','.ext');
        //   returns 4: 'path_ext'

        let b = path;
        let lastChar = b.charAt(b.length - 1);

        if (lastChar === '/' || lastChar === '\\') {
            b = b.slice(0, -1);
        }

        b = b.replace(/^.*[/\\]/g, '');

        if (typeof suffix === 'string' && b.substr(b.length - suffix.length) == suffix) {
            b = b.substr(0, b.length - suffix.length);
        }

        return b;
    }

    path (...paths) {
        return path.join(...paths);
    }
}
