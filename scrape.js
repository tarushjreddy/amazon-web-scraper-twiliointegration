const axios = require('axios');
const cheerio = require('cheerio');

require('dotenv').config();

const accSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH;

const twilio = require('twilio')(accSid, authToken);


console.log(accSid);''
const url = "https://www.amazon.in/Amazon-Brand-Decorative-Decoration-Housewarming/dp/B0D9BWFDJZ/ref=sr_1_1?_encoding=UTF8&content-id=amzn1.sym.e6fa9318-e027-4cdd-b9ef-b252fd717200&crid=2B2E4ELPDP0FZ&dib=eyJ2IjoiMSJ9.6UVsu6D9O3fWacp2oKhOCtiem6YgDfJ7vbz6qhMhHYOap6SZKDXNTKA2qz_H15iSIyqfam_999Zhlko-7G78H9rmgB0rsGWgJ6yp63LHqrvhvGdfHxTV20uckB0HmYdBfhsA4VJcsjD3LEUg1TbpUGqdzPXDVsAibDVgtPjBGKdIoR4Ihc_a3XEqqlefxanJrMksdmM_q_1cD_6fdVNjewIv3VncaGVNfgAI1AfGYOk.dCMLQ7R2sjzD1P4f1cIZ9Ak6AqfIjTSJK0J7fuiFAls&dib_tag=se&pd_rd_r=f47e973d-4cfd-4bc8-9eaa-00a34a406010&pd_rd_w=ZIKJW&pd_rd_wg=pUzRV&pf_rd_p=e6fa9318-e027-4cdd-b9ef-b252fd717200&pf_rd_r=QH9Y67BPC8K3BJKR6Q4N&qid=1735842137&sprefix=wall+arts%2C+paintings%2C+decor%2C+clock%2Cspecialty-aps%2C194&sr=8-1&srs=26129819031";
const product = { name: "", price: "", link: "" };

// Set Interval 
const handle = setInterval(scrape, 20000);

async function scrape() {
    const { data } = await axios.get(url);

    //which loads only upto the html data

    const $ = cheerio.load(data);
    const item = $('div#dp-container');
    // trying to get the product name from the element 
    product.name = $(item).find("h1 span#productTitle").text().replace(/[" "]/g, "")
    // console.log(product.name)
    product.link = url;

    const price = parseInt($(item).find("span .a-price-whole").first().text().replace(/[,.]/g, ""))
    // console.log(typeof (price))


    //Send an SMS
    if (price > 10) {
        twilio.messages.create({
            body: `Hello from Project TR\n Price of ${product.name} \nwhch you requested is Rs${price}/- \n Please click on the link ${product.url}`,
            from: '+12695202209',
            to: '+917483393485'
        }).then(message => {
            console.log(message)
            clearInterval(handle)
        })

    }
}

scrape();