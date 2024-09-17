import React from 'react'
import FormSection from '../../components/Form/FormSection'

const ExamType = () => {
  return (
    <div>
        <FormSection title="Exam Type">
            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="examType">Exam Type</label>
                        <input type="text" className="form-control" id="examType" placeholder="Enter Exam Type" />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="examTypeCode">Exam Type Code</label>
                        <input type="text" className="form-control" id="examTypeCode" placeholder="Enter Exam Type Code" />
                    </div>
                </div>
            </div>
        </FormSection>
    </div>
  )
}

export default ExamType