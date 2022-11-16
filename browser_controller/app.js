const { platform } = require('os');
const { exec } = require('child_process');



// var url = 'https://www.wikipedia.com';
// var browser = 'chrome';
var pids={};

function open_browser( browser_input , url){
    let status='', browser;
    if(browser_input == 'chrome') browser= 'chrome';
    else if(browser_input == 'firefox') browser= 'firefox';
    else{
        status= 'browser param invalid. Taking firefox as a default browser.';
        console.log(status);
        browser= 'firefox';
    }

    if (url === undefined) {
        console.error('Please enter a URL, e.g. "http://www.browserstack.com"');
        status+= '  invalid url';
        return {code:0, status};//failed
        // process.exit(0);
    }
    let command;
        
    if (process.platform === 'win32') {
        command = `start ${url}`;
    } else if (process.platform === 'darwin') {
        command = `open -a "${browser}" ${url}`;
    } else {
        status+= '  No platform detected';
        console.log(status);
        command = `google-chrome --no-sandbox ${url}`;
    }
    console.log(`exec command: ${command}`); 
    pids[browser_input] = exec(command).pid;
    console.log(pids, 'process ids');
    return {code:1, status};//success exec
}

function kill_browser(browser_input){
    let status='browser killed', browser, pid;
    if(browser_input == 'chrome') browser= 'chrome';
    else if(browser_input == 'firefox') browser= 'firefox';
    else{
        status= 'browser param invalid.';
        console.log(status);
        browser= 'Firefox';
        return {status};
    }
    console.log(`:test: ${browser} kill`);
    exec(`taskkill/im ${browser}.exe`);
    return {status};
}

function cleanUp(browser_input){
    let status='browser killed', browser, pid;
    if(browser_input == 'chrome'){
         browser= 'chrome';
         exec(`del %LOCALAPPDATA%\Google\Chrome\User Data\Default\Code Cache\Js /f /q /s`); 
    }
    // else if(browser_input == 'firefox'){
    //     browser= 'firefox';
    //     exec(`del %LOCALAPPDATA%\Mozilla\Firefox\Profiles\6by1fct6.default-release\cache2 /f /q /s`);
    // }
    else if(browser_input == 'msedge'){
        browser= 'msedge';
        exec(`del "C:\\Users\\mohit\\AppData\\Local\\Microsoft\\Edge\\User Data\\Default\\Code Cache\\js" /f /q /s`);
        exec(`taskkill/im ${browser}.exe`);
    }
    else{
        status= 'browser param invalid.';
        console.log(status);
        browser= 'Firefox';
        return {status};
    }
    console.log(`:test: ${browser} clear`);  
    return {status};
}

module.exports= {
    open_browser,
    kill_browser,
    cleanUp
}