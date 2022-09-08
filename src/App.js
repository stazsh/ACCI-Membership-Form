import './App.css';
import React, { useEffect, useState } from 'react';
import ACCI from './assets/acci-asn.png';
import axios from 'axios';

function App() {
    const [formState, setFormState] = useState([]);
    const [uploadingState, setUploadingState] = useState(0);

    const checkDesignSpecValid = () => {
        var x = document.getElementById('applicant_designation');
        var y = document.getElementById('nm_designation');

        if (x.value === 'others') {
            document.getElementById('applicant_designation_div').hidden = false;
        } else {
            document.getElementById('applicant_designation_div').hidden = true;
        }

        if (y.value === 'others') {
            document.getElementById('nm_designation_div').hidden = false;
        } else {
            document.getElementById('nm_designation_div').hidden = true;
        }
    }

    const checkNotEmpty = () => {
        var docFields = [];

        let fields = ['field1', 'field2', 'field3', 'field4', 'applicant_designation', 'field7', 'field8', 'field9', 'field10', 'field11', 'field12', 'field26', 'field27'];
        fields = [...fields, 'field13', 'field14', 'field15', 'field16', 'field17', 'field18', 'nm_designation', 'field21', 'field22', 'field23', 'field24', 'field25', 'field28'];

        fields.forEach((element) => {
            docFields.push(document.getElementById(element));
        });

        var isEmpty = false;
        docFields.forEach(element => {
            if (element.value === '<none>' || element.value === '')
                isEmpty = true;
        });

        if (
            (
                document.getElementById('applicant_designation').value === 'others' &&
                document.getElementById('applicant_designation_specification').value === ''
            ) || (
                document.getElementById('nm_designation').value === 'others' &&
                document.getElementById('nm_designation_specification').value === ''
            )
        )
            isEmpty = true;

        if (isEmpty)
            alert('One or more required fields are empty ⚠️');
    };

    useEffect(() => {
        checkDesignSpecValid();
    }, []);

    const handleFormChange = (event) => {
        console.log(event.target.value);
        checkDesignSpecValid();
        setFormState((prevState) => {
            return {
                ...prevState,
                [event.target.name]: event.target.value
            }
        });
    }

    const convertBlobToBase64 = async (blob) => { // blob data
        return await blobToBase64(blob);
    }

    const blobToBase64 = blob => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const handleFileInputFormChange = async (event) => {
        try {
            console.log(event.target.value);
            setUploadingState(prevState => prevState + 1);
            var b64 = await convertBlobToBase64(event.target.files[0]);
            const response = await axios.post('https://acci-api.herokuapp.com/imagekitify', {
                base64: b64
            });

            console.log(response);
            document.getElementById(`${event.target.id}-preview-div`).style.background =
                `center / contain no-repeat url("${response.data.url}"), radial-gradient(rgb(247, 247, 247), rgb(247, 247, 247))`;
            document.getElementById(`${event.target.id}-preview-div`).style.backgroundSize = 'auto 300px';
            document.getElementById(`${event.target.id}-preview-div`).style.marginBottom = '18px';
            document.getElementById(`${event.target.id}-preview-div`).style.visibility = 'visible';
            document.getElementById(`${event.target.id}-preview-div`).style.height='300px';

            if (event.target.id === 'field22')
                document.getElementById(`${event.target.id}-preview-div`).style.marginTop = '18px';

            setFormState((prevState) => {
                return {
                    ...prevState,
                    [event.target.name]: response.data.url
                }
            });
        } catch (e) {
            console.log(e);
        }
        setUploadingState(prevState => prevState - 1);
    };

    const onFormSubmit = async () => {
        if (!document.getElementById('check1').checked) {
            alert('✅ Please confirm by checking the confirmation box.');
            return
        }
        checkNotEmpty();
        console.log(formState);
        const response = await axios.post('https://acci-api.herokuapp.com/new-submission', formState);
        console.log(response);
        alert('Form submitted successfully ✅');
    }

    return (
        <>
            {(uploadingState > 0) ?
                <div className='dialogue'>
                    Uploading in progress in the background.
                </div> : <></>}
            <div className="App">
                <div className='Sub-App'>
                    <img src={ACCI} alt="ACCI logo" style={{ width: '50%' }} /><br /><br />
                    <span className='heading'>Membership Application Form</span><br /><br /><br /><br />
                    <form className='left-align'>
                        <fieldset><legend>Membership &amp; Company</legend>
                            <div style={{ textAlign: 'left' }}><span>Membership Type<code className='required'>*</code></span></div>
                            <select id='field1' name="membership_type" className='input-field' style={{ height: '25px' }} onChange={handleFormChange}>
                                <option value="<none>">&lt;none&gt;</option>
                                <option value="Life Membership">Life Membership</option>
                                <option value="Patron Membership">Patron Membership</option>
                                <option value="Affilated Membership">Affilated Membership</option>
                            </select>
                            <br /><br />

                            <div style={{ textAlign: 'left' }}><span>Name of Company / Firm<code className='required'>*</code></span></div>
                            <input id='field2' type='text' onChange={handleFormChange} name='name_of_company_firm' className='input-field' maxLength={61} />
                        </fieldset><br /><br />

                        <fieldset><legend>Applicant Information &amp; Company Metadata</legend>
                            <div style={{ textAlign: 'left' }}><span>Name of Applicant<code className='required'>*</code></span></div>
                            <input id='field3' type='text' onChange={handleFormChange} name='name_of_applicant' className='input-field' maxLength={61} /><br /><br />

                            <div style={{ textAlign: 'left' }}><span>Photo of Applicant <b>(max. 200kB)</b><code className='required'>*</code></span></div>
                            <input id='field4' type='file' alt='Photo of applicant' name='photo_of_applicant' style={{ marginTop: '3px' }} accept='image/*' onChange={handleFileInputFormChange} /><br /><br />

                            <div className='imagebox' id='field4-preview-div'></div>

                            <div style={{ textAlign: 'left' }}><span>Designation<code className='required'>*</code></span></div>
                            <select id='applicant_designation' name="applicant_designation" className='input-field' style={{ height: '25px' }} onChange={handleFormChange}>
                                <option value="<none>">&lt;none&gt;</option>
                                <option value="Proprietor">Proprietor</option>
                                <option value="Partner">Partner</option>
                                <option value="Director">Director</option>
                                <option value="others">others...</option>
                            </select>
                            <br /><br />

                            <div id='applicant_designation_div'>
                                <div style={{ textAlign: 'left' }}><span>If designation is <b><code>others</code></b>, please specify<code className='required'>*</code></span></div>
                                <input type='text' id='applicant_designation_specification' onChange={handleFormChange} name='applicant_designation_specification' maxLength={61} style={{ backgroundColor: '#cfebfa' }} className='input-field' /><br /><br />
                            </div>

                            <div style={{ textAlign: 'left' }}><span>Aadhaar Number<code className='required'>*</code></span></div>
                            <input id='field7' type='text' onChange={handleFormChange} name='aadhaar_number' className='input-field' maxLength={61} /><br /><br />

                            <div style={{ textAlign: 'left' }}><span>Photo of Aadhaar Card <b>(max. 200kB)</b><code className='required'>*</code></span></div>
                            <input id='field8' type='file' name='aadhaar_photo' style={{ marginTop: '3px' }} accept='image/*' onChange={handleFileInputFormChange} /><br /><br />

                            <div className='imagebox' id='field8-preview-div'></div>

                            <div style={{ textAlign: 'left' }}><span>PAN Number<code className='required'>*</code></span></div>
                            <input id='field9' type='text' onChange={handleFormChange} name='pan_number' className='input-field' maxLength={61} /><br /><br />

                            <div style={{ textAlign: 'left' }}><span>Photo of PAN Card <b>(max. 200kB)</b><code className='required'>*</code></span></div>
                            <input id='field10' type='file' name='pan_photo' style={{ marginTop: '3px' }} accept='image/*' onChange={handleFileInputFormChange} /><br /><br />

                            <div className='imagebox' id='field10-preview-div'></div>

                            <div style={{ textAlign: 'left' }}><span>GST Number<code className='required'>*</code></span></div>
                            <input id='field11' type='text' onChange={handleFormChange} name='gst_number' className='input-field' maxLength={61} /><br /><br />

                            <div style={{ textAlign: 'left' }}><span>CIN Number<code className='required'>*</code></span></div>
                            <input id='field27' type='text' onChange={handleFormChange} name='cin_number' className='input-field' maxLength={61} /><br /><br />

                            <div style={{ textAlign: 'left' }}><span>Address<code className='required'>*</code></span></div>
                            <input id='field12' type='text' onChange={handleFormChange} name='address' className='input-field' maxLength={61} /><br /><br />

                            <div style={{ textAlign: 'left' }}><span>Contact Number<code className='required'>*</code></span></div>
                            <input id='field13' type='text' onChange={handleFormChange} name='contact_number' className='input-field' maxLength={61} /><br /><br />

                            <div style={{ textAlign: 'left' }}><span>E-mail ID<code className='required'>*</code></span></div>
                            <input id='field14' type='email' onChange={handleFormChange} name='email_id' className='input-field' maxLength={61} /><br /><br />
                                
                            <div style={{ textAlign: 'left' }}><span>Document related to Business / Profession<code className='required'>*</code></span></div>
                            <input id='field28' type='text' onChange={handleFormChange} name='document_proof_description' className='input-field' maxLength={61} /><br /><br />

                            <div style={{ textAlign: 'left' }}><span>Photo of document related to Business / Profession <b>(max. 200kB)</b><code className='required'>*</code></span></div>
                            <input id='field15' type='file' name='document_proof_photo' style={{ marginTop: '3px' }} accept='image/*' onChange={handleFileInputFormChange} /><br /><br />

                            <div className='imagebox' id='field15-preview-div'></div>

                            <div style={{ textAlign: 'left' }}><span>Main line of Business / Profession</span><code className='required'>*</code></div>
                            <input id='field16' type='text' onChange={handleFormChange} name='main_line' className='input-field' maxLength={61} />
                        </fieldset><br /><br />

                        <fieldset><legend>Nominative Representative Information</legend>
                            <div style={{ textAlign: 'left' }}><span>Nominative Representative</span><code className='required'>*</code></div>
                            <input id='field17' type='text' onChange={handleFormChange} name='name_of_nm' className='input-field' maxLength={61} /><br /><br />

                            <div style={{ textAlign: 'left' }}><span>Photo of Nominative Representative <b>(max. 200kB)</b><code className='required'>*</code></span></div>
                            <input id='field18' type='file' name='photo_of_nm' style={{ marginTop: '3px' }} accept='image/*' onChange={handleFileInputFormChange} /><br /><br />

                            <div className='imagebox' id='field18-preview-div'></div>

                            <div style={{ textAlign: 'left' }}><span>Designation</span><code className='required'>*</code></div>
                            <select id='nm_designation' name="nm_designation" className='input-field' style={{ height: '25px' }} onChange={handleFormChange}>
                                <option value="<none>">&lt;none&gt;</option>
                                <option value="Proprietor">Proprietor</option>
                                <option value="Partner">Partner</option>
                                <option value="Director">Director</option>
                                <option value="others">others...</option>
                            </select>
                            <br /><br />

                            <div id='nm_designation_div'>
                                <div style={{ textAlign: 'left' }}><span>If Nominative Representative's designation is <b><code>others</code></b>, please specify</span><code className='required'>*</code></div>
                                <input type='text' id='nm_designation_specification' onChange={handleFormChange} maxLength={61} name='nm_designation_specification' className='input-field' style={{ backgroundColor: '#cfebfa' }} /><br /><br />
                            </div>

                            <div style={{ textAlign: 'left' }}><span>Aadhaar Number<code className='required'>*</code></span></div>
                            <input id='field21' type='text' onChange={handleFormChange} name='nm_aadhaar_number' maxLength={61} className='input-field' /><br /><br />

                            <div style={{ textAlign: 'left' }}><span>Photo of Nominative Representative's Aadhaar Card <b>(max. 200kB)</b><code className='required'>*</code></span></div>
                            <input id='field22' type='file' name='nm_aadhaar_photo' style={{ marginTop: '3px' }} accept='image/*' onChange={handleFileInputFormChange} />

                            <div className='imagebox' id='field22-preview-div'></div>
                        </fieldset><br /><br />

                        <fieldset><legend>Payment &amp; Review</legend>
                            <div style={{ textAlign: 'left' }}><span>Amount <b>(in INR)</b><code className='required'>*</code></span></div>
                            <input id='field23' type='text' onChange={handleFormChange} name='amount' maxLength={61} className='input-field' /><br /><br />

                            <div style={{ textAlign: 'left' }}><span>Payment Details<code className='required'>*</code></span></div>
                            <input id='field24' type='text' onChange={handleFormChange} name='payment_details' maxLength={61} className='input-field' /><br /><br />

                            <div style={{ textAlign: 'left' }}><span>Proposed by<code className='required'>*</code></span></div>
                            <input id='field25' type='text' onChange={handleFormChange} name='proposed_by' maxLength={61} className='input-field' /><br /><br />

                            <div style={{ textAlign: 'left' }}><span>ID<code className='required'>*</code></span></div>
                            <input id='field26' type='text' onChange={handleFormChange} name='proposed_by_id' maxLength={61} className='input-field' /><br /><br />
                        </fieldset><br />

                        <div style={{ marginLeft: '20px', marginRight: '20px' }}>
                            <input type='checkbox' id='check1' /><span className='smol-text'>&nbsp;I certify that the above facts are true to the best of my knowledge and belief and I understand that I subject myself to strict authoritative action in the event that the above facts are found to be falsified. </span>
                            <br /><br /><br />
                        </div>

                        <div style={{ display: 'flex' }}>
                            <input type='reset' className='button-4' />
                            <div style={{ flex: '1 1 auto' }} />
                            <button className='button-3' onClick={(e) => { e.preventDefault(); onFormSubmit(); }}>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default App;
