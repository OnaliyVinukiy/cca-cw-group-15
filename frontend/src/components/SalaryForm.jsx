import { useState } from 'react';
import { submitSalary } from '../services/api';
import '../styles/SalaryForm.css';

export default function SalaryForm() {
  const [formData, setFormData] = useState({
    role: '',
    company: '',
    country: '',
    experience_level: '',
    amount: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate form
    if (!formData.amount || formData.amount <= 0) {
      setError('Please enter a valid salary amount');
      return;
    }

    setLoading(true);
    try {
      const response = await submitSalary(formData);
      setSuccess('✓ Salary submitted successfully! Your submission is now pending community votes.');
      setFormData({ role: '', company: '', country: '', experience_level: '', amount: '' });
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.detail || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="salary-form-container">
      <h2>Submit Your Salary</h2>
      <p className="salary-form-subtitle">
        Help build transparency in tech industry salaries. Your information will be anonymized.
      </p>
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="form-group">
          <label>Job Role *</label>
          <input
            type="text"
            name="role"
            placeholder="e.g., Software Engineer, Product Manager"
            value={formData.role}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Company *</label>
          <input
            type="text"
            name="company"
            placeholder="e.g., Tech Corp"
            value={formData.company}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Country *</label>
          <input
            type="text"
            name="country"
            placeholder="e.g., United States, Canada"
            value={formData.country}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Experience Level *</label>
          <select
            name="experience_level"
            value={formData.experience_level}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">-- Select Level --</option>
            <option value="Junior">Junior (0-2 years)</option>
            <option value="Mid">Mid-Level (2-5 years)</option>
            <option value="Senior">Senior (5+ years)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Annual Salary (USD) *</label>
          <input
            type="number"
            name="amount"
            placeholder="e.g., 100000"
            value={formData.amount}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Salary Data'}
        </button>
      </form>

      <div className="anonymize-section">
        <label>
          <input type="checkbox" defaultChecked disabled />
          <strong>Data will be anonymized</strong>
        </label>
        <small>Your personal information will not be disclosed. Only salary data and job details are used.</small>
      </div>
    </div>
  );
}
