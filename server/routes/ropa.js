// server/routes/ropa.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

// --- THE MASTER OTP TEMPLATE ---
// This guarantees every single bureau and department shows up, even if empty.
const ORG_TEMPLATE = [
  {
    bureauId: 'bureau_1', bureauName: 'สำนักบริหารกลาง', hasData: false,
    subDepartments: [
      { id: 'dept_1', name: 'กลุ่มบริหารทรัพยากรบุคคล', color: '#0ea5e9', activities: [] },
      { id: 'dept_2', name: 'กลุ่มบริหารพัสดุ', color: '#10b981', activities: [] },
      { id: 'dept_3', name: 'กลุ่มบริหารงานคลัง', color: '#f59e0b', activities: [] },
      { id: 'dept_4', name: 'ฝ่ายนิติการ', color: '#ef4444', activities: [] },
      { id: 'dept_5', name: 'กลุ่มพัฒนาระบบบริหาร', color: '#8b5cf6', activities: [] },
      { id: 'dept_6', name: 'ฝ่ายประชาสัมพันธ์และการสื่อสาร', color: '#ec4899', activities: [] },
      { id: 'dept_7', name: 'ฝ่ายบริหารงานทั่วไป สบก.', color: '#64748b', activities: [] },
      { id: 'dept_10', name: 'ฝ่ายช่วยอํานวยการและประสานราชการ', color: '#94a3b8', activities: [] }
    ]
  },
  {
    bureauId: 'bureau_2', bureauName: 'กองจัดระบบการจราจรทางบก', hasData: false,
    subDepartments: [
      { id: 'dept_11', name: 'งานธุรการ', color: '#94a3b8', activities: [] },
      { id: 'dept_12', name: 'ฝ่ายนโยบายและแผนการจราจรทางบก', color: '#94a3b8', activities: [] },
      { id: 'dept_13', name: 'ฝ่ายพัฒนาระบบการจราจรทางบก', color: '#94a3b8', activities: [] }
    ]
  },
  {
    bureauId: 'bureau_3', bureauName: 'กองพัฒนาระบบการขนส่งและจราจร', hasData: false,
    subDepartments: [
      { id: 'dept_14', name: 'งานธุรการ', color: '#94a3b8', activities: [] },
      { id: 'dept_15', name: 'กลุ่มโครงข่ายและการเชื่อมต่อการขนส่ง', color: '#94a3b8', activities: [] },
      { id: 'dept_16', name: 'กลุ่มเทคโนโลยีการขนส่งและจราจร', color: '#94a3b8', activities: [] },
      { id: 'dept_17', name: 'กลุ่มขนส่งสาธารณะและสิ่งอํานวยความสะดวก', color: '#94a3b8', activities: [] }
    ]
  },
  {
    bureauId: 'bureau_4', bureauName: 'ศูนย์เทคโนโลยีสารสนเทศการขนส่งและจราจร', hasData: false,
    subDepartments: [
      { id: 'dept_8', name: 'กลุ่มพัฒนาระบบคอมพิวเตอร์และเครือข่าย ศทท.', color: '#06b6d4', activities: [] },
      { id: 'dept_18', name: 'งานธุรการ', color: '#94a3b8', activities: [] },
      { id: 'dept_19', name: 'กลุ่มนโยบายและบริหารสารสนเทศ', color: '#94a3b8', activities: [] },
      { id: 'dept_20', name: 'กลุ่มพัฒนาระบบข้อมูลสารสนเทศ', color: '#94a3b8', activities: [] }
    ]
  },
  {
    bureauId: 'bureau_5', bureauName: 'สำนักงานโครงการบริหารจัดการระบบตั๋วร่วม', hasData: false,
    subDepartments: [
      { id: 'dept_21', name: 'งานธุรการ', color: '#94a3b8', activities: [] }
    ]
  },
  {
    bureauId: 'bureau_6', bureauName: 'สำนักงานโครงการพัฒนาระบบราง', hasData: false,
    subDepartments: [
      { id: 'dept_22', name: 'งานธุรการ', color: '#94a3b8', activities: [] },
      { id: 'dept_23', name: 'กลุ่มยุทธศาสตร์และแผนการขนส่งทางราง', color: '#94a3b8', activities: [] },
      { id: 'dept_24', name: 'กลุ่มมาตรฐานระบบราง', color: '#94a3b8', activities: [] },
      { id: 'dept_25', name: 'กลุ่มกํากับการขนส่งทางราง', color: '#94a3b8', activities: [] }
    ]
  },
  {
    bureauId: 'bureau_7', bureauName: 'สำนักแผนความปลอดภัย', hasData: false,
    subDepartments: [
      { id: 'dept_26', name: 'งานธุรการ', color: '#94a3b8', activities: [] },
      { id: 'dept_27', name: 'กลุ่มพัฒนาความปลอดภัย', color: '#94a3b8', activities: [] },
      { id: 'dept_28', name: 'กลุ่มบริหารความมั่นคงด้านการขนส่ง', color: '#94a3b8', activities: [] },
      { id: 'dept_29', name: 'กลุ่มส่งเสริมการขนส่งที่ยั่งยืน', color: '#94a3b8', activities: [] }
    ]
  },
  {
    bureauId: 'bureau_8', bureauName: 'สำนักแผนงาน', hasData: false,
    subDepartments: [
      { id: 'dept_9', name: 'กลุ่มติดตามและประเมินผล', color: '#84cc16', activities: [] },
      { id: 'dept_30', name: 'ฝ่ายบริหารงานทั่วไป', color: '#94a3b8', activities: [] },
      { id: 'dept_31', name: 'กลุ่มแผนมหภาค', color: '#94a3b8', activities: [] }
    ]
  },
  {
    bureauId: 'bureau_9', bureauName: 'สำนักส่งเสริมระบบการขนส่งและจราจรในภูมิภาค', hasData: false,
    subDepartments: [
      { id: 'dept_32', name: 'งานธุรการ', color: '#94a3b8', activities: [] }
    ]
  }
];

const transformLegacyData = (legacyArray) => {
  // 1. Create a fresh, deep copy of the empty template
  const dataStructure = JSON.parse(JSON.stringify(ORG_TEMPLATE));

  legacyArray.forEach(item => {
    const owner = (item.dataOwner || "").trim();
    let targetBureau = null;
    let targetDept = null;

    // 2. The Smart Mapper: Finds the exact pre-made bucket for the legacy data
    if (/สบก\.|บริหารทรัพยากรบุคคล|บริหารพัสดุ|บริหารงานคลัง|นิติการ|พัฒนาระบบบริหาร|ประชาสัมพันธ์|ช่วยอํานวยการ/.test(owner)) {
      targetBureau = dataStructure.find(b => b.bureauId === 'bureau_1');
      if (owner.includes('ทรัพยากรบุคคล')) targetDept = targetBureau.subDepartments.find(d => d.id === 'dept_1');
      else if (owner.includes('พัสดุ')) targetDept = targetBureau.subDepartments.find(d => d.id === 'dept_2');
      else if (owner.includes('คลัง')) targetDept = targetBureau.subDepartments.find(d => d.id === 'dept_3');
      else if (owner.includes('นิติการ')) targetDept = targetBureau.subDepartments.find(d => d.id === 'dept_4');
      else if (owner.includes('พัฒนาระบบบริหาร')) targetDept = targetBureau.subDepartments.find(d => d.id === 'dept_5');
      else if (owner.includes('ประชาสัมพันธ์')) targetDept = targetBureau.subDepartments.find(d => d.id === 'dept_6');
      else if (owner.includes('ทั่วไป') || owner.includes('สบก')) targetDept = targetBureau.subDepartments.find(d => d.id === 'dept_7');
      else targetDept = targetBureau.subDepartments[0];
    }
    else if (/ศทท\.|เทคโนโลยีสารสนเทศ|พัฒนาระบบคอมพิวเตอร์/.test(owner)) {
      targetBureau = dataStructure.find(b => b.bureauId === 'bureau_4');
      if (owner.includes('พัฒนาระบบคอมพิวเตอร์')) targetDept = targetBureau.subDepartments.find(d => d.id === 'dept_8');
      else if (owner.includes('บริหารสารสนเทศ')) targetDept = targetBureau.subDepartments.find(d => d.id === 'dept_19');
      else if (owner.includes('ระบบข้อมูล')) targetDept = targetBureau.subDepartments.find(d => d.id === 'dept_20');
      else targetDept = targetBureau.subDepartments[0]; 
    }
    else if (/สผง\.|แผนงาน|ติดตาม\s*และประเมินผล/.test(owner)) {
      targetBureau = dataStructure.find(b => b.bureauId === 'bureau_8');
      if (owner.includes('ติดตาม')) targetDept = targetBureau.subDepartments.find(d => d.id === 'dept_9');
      else if (owner.includes('ทั่วไป')) targetDept = targetBureau.subDepartments.find(d => d.id === 'dept_30');
      else if (owner.includes('มหภาค')) targetDept = targetBureau.subDepartments.find(d => d.id === 'dept_31');
      else targetDept = targetBureau.subDepartments[0];
    } else {
      // Fallback: If it belongs to a completely unknown department, put it in an "Others" category
      targetBureau = dataStructure.find(b => b.bureauId === 'bureau_99');
      if (!targetBureau) {
        targetBureau = { bureauId: 'bureau_99', bureauName: 'สำนัก/กอง อื่นๆ', hasData: false, subDepartments: [] };
        dataStructure.push(targetBureau);
      }
      targetDept = targetBureau.subDepartments.find(d => d.name === owner);
      if (!targetDept) {
        targetDept = { id: 'dept_misc_' + Date.now(), name: owner, color: '#64748b', activities: [] };
        targetBureau.subDepartments.push(targetDept);
      }
    }

    // 3. Format the Activity
    const activity = {
      id: `act_${item.id}`,
      name: item.activityName || "-",
      dataController: item.dataController || "-",
      dpo: item.dpo || "-",
      contactInfo: {
        address: item.address || "-",
        email: item.email || "-",
        phone: item.contactNumber || "-"
      },
      formNameA1: item.formName || "-",
      dataSourceA2: item.dataSource || "-",
      generalData: (item.personalDataTypes && item.personalDataTypes !== "-") ? item.personalDataTypes.split(/\s+/) : [],
      sensitiveData: (item.sensitiveData && item.sensitiveData !== "-") ? item.sensitiveData.split(/\s+/) : [],
      lawfulBasis24: item.lawfulBasis24 || "-",
      lawfulBasis26: item.lawfulBasis26 || "-",
      purposeOfCollectionC1: item.collectionPurpose || "-",
      dataUserC2: item.dataUsersAndPurpose || "-",
      collectionSourceC3: item.collectionSource || "-",
      collectionMediumC4: item.collectionMedium || "-",
      physicalStorageD1: item.physicalStorage || "-",
      electronicStorageD2: item.electronicStorage || "-",
      internalUsageE1: "-", 
      internalAccessE2: item.personalDataAccess || "-",
      externalDisclosureF1: item.externalParty || "-",
      transferModeF2: item.transferMode || "-",
      retentionPeriodG1: item.retentionPeriod > 0 ? `${item.retentionPeriod} ปี` : "ไม่ระบุ / ตลอดอายุการใช้งาน",
      disposalMethodG2: item.disposalMethods || "-",
      technicalMeasuresH1: item.techMeasures || "-",
      organizationalMeasuresH2: item.orgMeasures || "-",
      activityStatusI1: item.status || "-",
      lastUpdateI2: item.updateDate ? item.updateDate.split(' ')[0] : "-", 
      revisionI3: item.modifyDetail || "-"
    };

    // 4. Put the activity into the bucket and light up the Bureau!
    targetDept.activities.push(activity);
    targetBureau.hasData = true; // This tells React to turn it blue instead of grey!
  });

  return dataStructure;
};

router.get('/', async (req, res) => {
  try {
    const legacyResponse = await axios.get('http://192.168.1.84:5000/api/forms');
    const rawLegacyData = legacyResponse.data;

    if (!Array.isArray(rawLegacyData)) {
      return res.status(500).json({ error: 'Invalid data format from legacy server' });
    }

    const formattedData = transformLegacyData(rawLegacyData);
    res.json(formattedData);

  } catch (error) {
    console.error('Error fetching from legacy ROPA system:', error.message);
    res.status(500).json({ error: 'Failed to fetch live ROPA data' });
  }
});

module.exports = router;