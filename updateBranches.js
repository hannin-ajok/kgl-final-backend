require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Sale = require('./models/Sale');
const CreditSale = require('./models/CreditSale');
const Produce = require('./models/Produce');
const User = require('./models/User');

const updateBranches = async () => {
  await connectDB();
  try {
    // Update various possible old branch names
    const updates = [
      { old: 'branch 1', new: 'branch maganjo' },
      { old: 'branch 2', new: 'branch matugga' },
      { old: 'Branch 1', new: 'branch maganjo' },
      { old: 'Branch 2', new: 'branch matugga' },
      { old: 'branch1', new: 'branch maganjo' },
      { old: 'branch2', new: 'branch matugga' },
    ];
    for (const { old, new: newBranch } of updates) {
      // Update every collection that stores a branch label so reporting stays aligned.
      const sale = await Sale.updateMany({ branch: old }, { branch: newBranch });
      const credit = await CreditSale.updateMany({ branch: old }, { branch: newBranch });
      const produce = await Produce.updateMany({ branch: old }, { branch: newBranch });
      const user = await User.updateMany({ branch: old }, { branch: newBranch });
      console.log(`Updated ${old} to ${newBranch}: Sales ${sale.modifiedCount}, Credit ${credit.modifiedCount}, Produce ${produce.modifiedCount}, Users ${user.modifiedCount}`);
    }
    console.log('Branches updated successfully!');
  } catch (err) {
    console.error('Update error:', err.message);
  } finally {
    // Close connection even if one of the updates fails midway.
    mongoose.connection.close();
  }
};

updateBranches();
