#!/usr/bin/env bash


response=$(curl -s \
      -H "Content-Type: application/json" \
      --data '{"email":"a@a.com","password":"1"}' \
      localhost:42069/auth)
status=$(echo $response| jq -r .status)
token=$(echo $response| jq -r .token)
if [ $status = "0" ]; then
  curl -H "Authorization: $token" localhost:5051/loans
  curl -H "Authorization: $token" localhost:5000/accounts
else
  echo "The request failed"
  echo $response
  exit 1
fi
# token="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFAYS5jb20iLCJpYXQiOjE1NzMyMDcyOTV9.suswVXT3_ZP7W03wBrT2mua6mVQAzHF4Xu99R7RIUjtPrJjsRQ-LYYppSn1hbJU6uq1Cb4wnrFgLUix_4iCqBZDma_e6vLHMplNMAryBb9U3nhdmV9Ge8rCBXuHlzsyv-B4t3H67aHGwJB-cktO7KIpw1CUltU-lCyWelqPVtrPRsjnWa-RQR0LSef6hxEaiATI6RXdxbQFC6MSf1zClvRpAGjZCYiV_8-cE65ksCv5KPWehq7AJHUc_fXtcGGDTsXJbM4Xm6q5x7Gs401P_affKVqHyq7jtukK8Uq6VOtaiGI-r8fWaHm-hifDimuDUMhZo4LRj_GMBqNp-QnsUbR7pzZ6dcbDSgGQlzJsfXC2aD1eBCTg_FKCHx0nAw5-oSWCLkJbFhxQK-JPmvjUXIkhkyBQ2FfR6X-pyyjYxB7Tpt26ozfR484CwpGECv-lX8BSDMCl4V5glJC1vx4HTIKV91PHX9cwku62OZ0ZNHJ--Mtsm-zlIdsPhPTnh2OVaadYalNafjOJ0t5bLV93-2urAS-RC3IfVl5JVN91OHSmmn5pdWGm_WicydFX_0mVGduLJwgZrR1KylcCGJUUY50_KysQd8kqN7ZDB53xxExjrUchsZZsKoUZ9Qr1Mc3zoZxM1Yd2qtCTkH9jDCu2R0enTxcSwiuLtyefcDkHetEo"
